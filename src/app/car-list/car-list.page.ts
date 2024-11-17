import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CarService } from '../core/services/car.service';
import { Car } from '../models/car.model';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.page.html',
  styleUrls: ['./car-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonImg]
})
export class CarListPage implements OnInit {
  public cars: { id: string, data: Car }[] = [];

  constructor(private carService: CarService, private router: Router) { }

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

  public viewCarDetail(carId: string) {
    this.router.navigate(['/car-detail', carId]);
  }
}
