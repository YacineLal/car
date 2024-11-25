import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ErrorModalService} from "../app/core/services/error-modal.service";
@Component({
  selector: 'app-error-modal',
  template: `
    <div class="modal" *ngIf="isVisible">
      <div class="modal-content">
        <h1>Error</h1>
        <p>{{ errorMessage }}</p>
        <button (click)="closeModal()">Close</button>
      </div>
    </div>
  `,
  styleUrls: ['login-modal-component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ErrorModalComponent implements OnInit {
  errorMessage: string = '';
  isVisible: boolean = false;

  constructor(private errorModalService: ErrorModalService) {}

  ngOnInit(): void {
    this.errorModalService.visibility$.subscribe(visible => {
      this.isVisible = visible;
    });
    this.errorModalService.errorMessage$.subscribe(message => {
      this.errorMessage = message;
    });
  }

  closeModal(): void {
    this.errorModalService.hideModal();
  }
}
