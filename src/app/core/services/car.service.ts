import { Injectable } from '@angular/core';
import { getDatabase, ref, set } from 'firebase/database';
import { Car } from '../../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor() {}

  public addCarToDatabase(car: Car): Promise<boolean | unknown> {
    const database = getDatabase();
    console.log(database);

    return new Promise((resolve, reject) => {
      const newCarRef = ref(database, 'car/' + car.licensePlate);
      set(newCarRef, {
        brand: car.brand,
        model: car.model,
        licensePlate: car.licensePlate,
        frontPhoto: car.frontPhoto,
        rearPhoto: car.rearPhoto,
      }).then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }
}
