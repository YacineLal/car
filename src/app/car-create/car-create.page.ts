import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CarService } from '../core/services/car.service';
import { ErrorModalComponent } from '../../modals/error.modal.component';
import { Car } from '../models/car.model';
import { ErrorModalService } from '../core/services/error-modal.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-car-create',
  templateUrl: './car-create.page.html',
  styleUrls: ['./car-create.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModalComponent // Import ErrorModalComponent here
  ]
})
export class CarCreatePage implements OnInit {
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  public carForm = new FormGroup({
    brand: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    licensePlate: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z]{2}-\d{3}-[A-Z]{2}$|^\d{3}-[A-Z]{3}-\d{2}$/) // French license plate pattern
    ]),
    frontPhoto: new FormControl('', [Validators.required]),
    rearPhoto: new FormControl('', [Validators.required]),
  });

  constructor(
    private carService: CarService,
    private errorModalService: ErrorModalService
  ) {}

  ngOnInit() {}

  private async fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.carForm.valid) {
      const frontPhotoInput = document.getElementById('frontPhoto') as HTMLInputElement;
      const rearPhotoInput = document.getElementById('rearPhoto') as HTMLInputElement;

      if (frontPhotoInput.files && rearPhotoInput.files) {
        const frontPhotoFile = frontPhotoInput.files[0];
        const rearPhotoFile = rearPhotoInput.files[0];

        // Check file size limit (1MB = 1048576 bytes)
        const maxSize = 1048576;
        if (frontPhotoFile.size > maxSize || rearPhotoFile.size > maxSize) {
          this.errorModalService.showModal('The file size should not exceed 1MB.');
          return;
        }

        const frontPhotoBase64 = await this.fileToBase64(frontPhotoFile);
        const rearPhotoBase64 = await this.fileToBase64(rearPhotoFile);

        const car: Car = {
          brand: this.carForm.value.brand as string,
          model: this.carForm.value.model as string,
          licensePlate: this.carForm.value.licensePlate as string,
          frontPhoto: frontPhotoBase64,
          rearPhoto: rearPhotoBase64,
        };

        try {
          await this.carService.addCarToDatabase(car);
          console.log('Car added:', car);
          Swal.fire({
            title: 'Success!',
            text: 'Car added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            position: 'top', // Position the alert below the header
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          this.carForm.reset();
        } catch (error) {
          console.error('Error adding car:', error);
          if ((error as Error).message.includes('license plate')) {
            this.errorModalService.showModal('This license plate is already taken.');
          } else {
            this.errorModalService.showModal('An error occurred while adding the car.');
          }
        }
      }
    } else {
      this.errorModalService.showModal('Please fill out all required fields correctly.');
    }
  }

  public onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.carForm.get(controlName)?.setValue(input.files[0]);
    }
  }
}
