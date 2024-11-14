import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarCreatePage } from './car-create.page';

describe('CarCreatePage', () => {
  let component: CarCreatePage;
  let fixture: ComponentFixture<CarCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
