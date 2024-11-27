import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  template: `
    <div class="modal">
      <span class="close" (click)="closeModal()">&times;</span>
      <img [src]="imageUrl" alt="Full Size Image" class="full-img">
    </div>
  `,
  styles: [`
    .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: transparent;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 25px;
      color: #aaa;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
    .full-img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ImageModalComponent {
  @Input() imageUrl!: string;

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}
