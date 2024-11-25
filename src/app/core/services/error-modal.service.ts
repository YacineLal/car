import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {
  private visibilitySubject = new BehaviorSubject<boolean>(false);
  visibility$ = this.visibilitySubject.asObservable();

  private errorMessageSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.errorMessageSubject.asObservable();

  showModal(message: string): void {
    this.errorMessageSubject.next(message);
    this.visibilitySubject.next(true);
  }

  hideModal(): void {
    this.visibilitySubject.next(false);
  }
}
