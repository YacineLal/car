import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CarService } from '../core/services/car.service';
import { Car } from '../models/car.model';

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
  ]
})
export class CarCreatePage implements OnInit {
  public carForm = new FormGroup({
    brand: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    licensePlate: new FormControl('', [Validators.required]),
    frontPhoto: new FormControl('', [Validators.required]),
    rearPhoto: new FormControl('', [Validators.required]),
  });

  constructor(private carService: CarService) {}

  ngOnInit() {
    // Initialization logic here
  }

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

        const frontPhotoBase64 = await this.fileToBase64(frontPhotoFile);
        const rearPhotoBase64 = await this.fileToBase64(rearPhotoFile);

        const car: Car = {
          brand: this.carForm.value.brand as string,
          model: this.carForm.value.model as string,
          licensePlate: this.carForm.value.licensePlate as string,
          frontPhoto: frontPhotoBase64,
          rearPhoto: rearPhotoBase64,
        };

        this.carService.addCarToDatabase(car)
          .then(() => {
            console.log('Car added:', car);
            this.carForm.reset();
          })
          .catch((error) => {
            console.error('Error adding car:', error);
          });
      }
    }
  }
}
