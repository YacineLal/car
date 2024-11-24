import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private visibilitySubject = new BehaviorSubject<boolean>(false);
  visibility$ = this.visibilitySubject.asObservable();

  showModal() {
    this.visibilitySubject.next(true);
  }

  hideModal() {
    this.visibilitySubject.next(false);
  }
}
