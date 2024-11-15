import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { CarService } from '../core/services/car.service';
import { Car } from '../models/car.model';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.page.html',
  styleUrls: ['./car-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel]
})
export class CarListPage implements OnInit {
  public cars: Car[] = [];

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.loadCars();
  }

  private async loadCars() {
    try {
      this.cars = await this.carService.getCarsFromDatabase();
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }
}
