import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AlertController, IonicModule, ModalController} from '@ionic/angular';
import { CarService } from '../core/services/car.service';
import { Car } from '../models/car.model';
import { ErrorModalComponent } from '../../modals/error.modal.component';
import { ImageModalComponent } from 'src/modals/image-modal.component';
import { ErrorModalService } from '../core/services/error-modal.service';
import {CommonModule} from "@angular/common";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ErrorModalComponent

  ]
})
export class CarDetailPage implements OnInit {
  public car: Car | undefined;
  public carForm: FormGroup;
  private carId: string | undefined;
  public isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private errorModalService: ErrorModalService

) {
    // Initialize form group
    this.carForm = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      licensePlate: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z]{2}-\d{3}-[A-Z]{2}$|^\d{3}-[A-Z]{3}-\d{2}$/),
      ]),
      frontPhoto: new FormControl(null),
      rearPhoto: new FormControl(null),
    });
  }

  ngOnInit() {
    const carId = this.route.snapshot.paramMap.get('id');
    this.carId = carId !== null ? carId : undefined;
    if (this.carId) {
      this.loadCar(this.carId);
    } else {
      console.error('Car ID is null');
    }
  }

  private async loadCar(carId: string) {
    try {
      const carData = await this.carService.getCarById(carId);
      this.car = carData.data;

      // Populate the form with car details
      this.carForm.patchValue({
        brand: this.car?.brand,
        model: this.car?.model,
        licensePlate: this.car?.licensePlate,
      });
    } catch (error) {
      console.error('Error fetching car:', error);
    }
  }

  public enableEditMode() {
    this.isEditMode = true;
  }

  public async confirmUpdate() {
    if (this.carForm.valid && this.carId) {
      try {
        const updatedCar: Car = {
          ...this.car,
          brand: this.carForm.value.brand || '',
          model: this.carForm.value.model || '',
          licensePlate: this.carForm.value.licensePlate || '',
          frontPhoto: this.carForm.value.frontPhoto || this.car?.frontPhoto || '',
          rearPhoto: this.carForm.value.rearPhoto || this.car?.rearPhoto || '',
        };

        await this.carService.updateCar(this.carId, updatedCar);
        console.log('Car updated successfully');

        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: 'Car updated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          position: 'top', // Position the alert below the header
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        this.isEditMode = false;
        this.loadCar(this.carId); // Reload updated details
      } catch (error) {
        console.error('Error updating car:', error);

        // Show error modal or alert depending on error type
        if ((error as Error).message.includes('license plate')) {
          this.errorModalService.showModal('This license plate is already taken.');
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while updating the car.',
            icon: 'error',
            confirmButtonText: 'OK',
            position: 'top',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      }
    }
  }

  public cancelUpdate() {
    this.isEditMode = false;
    if (this.carId) {
      this.loadCar(this.carId);
    }
  }

  public async deleteCar() {
    if (this.carId) {
      const alert = await this.alertController.create({
        header: 'Confirm Delete',
        message: 'Are you sure you want to delete this car?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: async () => {
              try {
                await this.carService.deleteCar(this.carId!);
                console.log('Car deleted successfully');
                this.router.navigate(['/car-list']);
              } catch (error) {
                console.error('Error deleting car:', error);
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  public onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.carForm.patchValue({
          [controlName]: e.target.result,
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async openImageModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        imageUrl: imageUrl,
      },
    });
    return await modal.present();
  }
}
