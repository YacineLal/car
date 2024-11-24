import { Component, OnInit } from '@angular/core';
import { ModalService } from '../app/core/services/modal.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for Angular directives like *ngIf

@Component({
  selector: 'app-login-modal',
  template: `
    <div class="modal" *ngIf="isVisible">
      <div class="modal-content">
        <h1>Login Required</h1>
        <p>You need to Login First</p>
        <button (click)="closeModal()">OK</button>
      </div>
    </div>
  `,
  styleUrls: ['./login-modal-component.scss'],
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
})
export class LoginModalComponent implements OnInit {
  isVisible = false;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.visibility$.subscribe((visible) => {
      this.isVisible = visible;
    });
  }

  closeModal() {
    this.modalService.hideModal();
  }
}
