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

  public onSubmit(): void {
    if (this.carForm.valid) {
      const car: Car = {
        brand: this.carForm.value.brand as string,
        model: this.carForm.value.model as string,
        licensePlate: this.carForm.value.licensePlate as string,
        frontPhoto: this.carForm.value.frontPhoto as string,
        rearPhoto: this.carForm.value.rearPhoto as string,
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
