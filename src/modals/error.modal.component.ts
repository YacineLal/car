import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModalService } from '../app/core/services/error-modal.service';

@Component({
  selector: 'app-error-modal',
  template: `
    <div class="modal" *ngIf="isVisible" [attr.inert]="!isVisible ? true : null">
      <div class="modal-content">
        <h1>Error</h1>
        <p>{{ errorMessage }}</p>
        <button (click)="closeModal()">Close</button>
      </div>
    </div>
  `,
  styleUrls: ['./login-modal-component.scss'], // Corrected path
  standalone: true,
  imports: [CommonModule],
})
export class ErrorModalComponent implements OnInit {
  @Input() errorMessage: string = '';
  isVisible = false;

  constructor(private errorModalService: ErrorModalService) {}

  ngOnInit() {
    this.errorModalService.visibility$.subscribe((visible) => {
      this.isVisible = visible;
    });
  }

  closeModal() {
    this.errorModalService.hideModal();
  }
}
