import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalService } from '../app/core/services/login-modal.service';

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
  styleUrls: ['login-modal-component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LoginModalComponent implements OnInit {
  isVisible = false;

  constructor(private loginModalService: LoginModalService) {}

  ngOnInit() {
    this.loginModalService.visibility$.subscribe((visible) => {
      this.isVisible = visible;
    });
  }

  closeModal() {
    this.loginModalService.hideModal();
  }
}
