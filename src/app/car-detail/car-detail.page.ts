import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  AlertController,
  IonButton,
  IonItem, IonInput, IonLabel, IonImg,
  ModalController, IonIcon
} from '@ionic/angular/standalone';
import { CarService } from '../core/services/car.service';
import { Car } from '../models/car.model';
import { ImageModalComponent } from 'src/modals/image-modal.component';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput, IonLabel, IonImg, ImageModalComponent, IonIcon]
})
export class CarDetailPage implements OnInit {
  public car: Car | undefined;
  private carId: string | undefined;
  public isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

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
    } catch (error) {
      console.error('Error fetching car:', error);
    }
  }

  public enableEditMode() {
    this.isEditMode = true;
  }

  public async confirmUpdate() {
    if (this.car && this.carId) {
      try {
        await this.carService.updateCar(this.carId, this.car);
        console.log('Car updated successfully');
        this.isEditMode = false;
      } catch (error) {
        console.error('Error updating car:', error);
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
                this.router.navigateByUrl('/car-list', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/car-list']);
                });
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

  public onFileSelected(event: Event, photoType: 'frontPhoto' | 'rearPhoto') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.car) {
          this.car[photoType] = e.target.result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async openImageModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        imageUrl: imageUrl
      }
    });
    return await modal.present();
  }
}
