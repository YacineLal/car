import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, deleteDoc, getDoc, query, where, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
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
      const licensePlateExists = await this.checkDuplicateLicensePlate(car.licensePlate);
      if (licensePlateExists) {
        throw new Error('A car with this license plate already exists');
      }

      const docRef = await addDoc(collection(db, 'car'), car);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      throw e; // Propagate the error to the caller for handling
    }
  }

  // Check if a car with the same license plate exists
  async checkDuplicateLicensePlate(licensePlate: string): Promise<boolean> {
    const carsRef = collection(db, 'car');
    const q = query(carsRef, where("licensePlate", "==", licensePlate));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // If no cars exist, returns false, else returns true (duplicate found)
  }

  async getCarsFromDatabase(): Promise<{ id: string, data: Car }[]> {
    const carCollection = collection(db, 'car');
    const carSnapshot = await getDocs(carCollection);
    return carSnapshot.docs.map(doc => {
      const car = doc.data() as Car;
      console.log('Car ID:', doc.id);
      return { id: doc.id, data: car };
    });
  }

  async getCarById(id: string): Promise<{ id: string, data: Car }> {
    const carDoc = await getDoc(doc(db, 'car', id));
    if (carDoc.exists()) {
      return { id: carDoc.id, data: carDoc.data() as Car };
    } else {
      throw new Error('Car not found');
    }
  }

  async updateCar(id: string, car: Car): Promise<void> {
    try {
      await setDoc(doc(db, 'car', id), car);
      console.log('Document updated with ID: ', id);
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  }

  async deleteCar(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'car', id));
      console.log('Document deleted with ID: ', id);
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  }
}
