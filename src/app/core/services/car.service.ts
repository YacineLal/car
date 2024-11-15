import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { Car } from '../../models/car.model';

const firebaseConfig = {
  apiKey: "AIzaSyDPuzCSy9yzfcYqWYriNMOhWt3nrSz6BWY",
  authDomain: "car-app-ce04f.firebaseapp.com",
  projectId: "car-app-ce04f",
  storageBucket: "car-app-ce04f.appspot.com",
  messagingSenderId: "414749857039",
  appId: "1:414749857039:web:63db688d5a4e56a8bfda7a",
  databaseURL: "https://car-app-ce04f-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class CarService {
  constructor() {}

  async addCarToDatabase(car: Car): Promise<void> {
    try {
      const docRef = await addDoc(collection(db, 'car'), car);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  async getCarsFromDatabase(): Promise<Car[]> {
    const carCollection = collection(db, 'car');
    const carSnapshot = await getDocs(carCollection);
    return carSnapshot.docs.map(doc => doc.data() as Car);
  }
}
