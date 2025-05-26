import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Compound } from '../../models/compound.model';

@Component({
  selector: 'app-compound-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card-flip" [class.flipped]="isFlipped">
      <div class="card-flip-inner">
        <div class="card-flip-front">
          <div class="compound-card card">
            <div class="compound-image" (click)="toggleFlip()">
              <img [src]="compound.image" [alt]="compound.name" />
            </div>
            <div class="compound-info">
              <h3>{{ compound.name }}</h3>
              <div class="compound-actions">
                <button class="view-btn" [routerLink]="['/compounds', compound.id]">View</button>
                <button class="compare-btn" (click)="onAddToCompare()" [disabled]="isInCompare">
                  {{ isInCompare ? 'In Compare' : 'Compare' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-flip-back">
          <div class="compound-card-back card">
            <h3>{{ compound.name }}</h3>
            <p class="description-preview">{{ descriptionPreview }}</p>
            <div class="compound-actions">
              <button class="view-btn" [routerLink]="['/compounds', compound.id]">Details</button>
              <button class="edit-btn" [routerLink]="['/compounds', compound.id, 'edit']">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .compound-card {
      height: 320px;
      display: flex;
      flex-direction: column;
      transition: transform var(--transition-normal) ease, box-shadow var(--transition-normal) ease;
    }
    
    .compound-card-back {
      height: 320px;
      padding: var(--spacing-4);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: var(--primary-50);
      border: 1px solid var(--primary-200);
    }
    
    .compound-image {
      height: 200px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--neutral-100);
      cursor: pointer;
      transition: all var(--transition-normal) ease;
    }
    
    .compound-image:hover {
      background-color: var(--neutral-200);
    }
    
    .compound-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform var(--transition-normal) ease;
    }
    
    .compound-info {
      padding: var(--spacing-3);
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    
    .compound-info h3 {
      margin: 0;
      margin-bottom: var(--spacing-2);
      font-size: 1.1rem;
      color: var(--neutral-800);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .description-preview {
      color: var(--neutral-700);
      font-size: 0.9rem;
      line-height: 1.5;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      margin: var(--spacing-2) 0;
    }
    
    .compound-actions {
      display: flex;
      gap: var(--spacing-2);
      margin-top: auto;
    }
    
    .view-btn, .compare-btn, .edit-btn {
      flex: 1;
      padding: var(--spacing-1) var(--spacing-2);
      font-size: 0.85rem;
      border-radius: var(--border-radius);
      font-weight: 500;
      transition: all var(--transition-fast) ease;
      text-align: center;
    }
    
    .view-btn {
      background-color: var(--indigo-600);
      color: white;
    }
    
    .view-btn:hover {
      background-color: var(--indigo-700);
    }
    
    .compare-btn {
      background-color: var(--violet-600);
      color: white;
    }
    
    .compare-btn:hover:not([disabled]) {
      background-color: var(--violet-700);
    }
    
    .compare-btn[disabled] {
      background-color: var(--violet-400);
      cursor: not-allowed;
    }
    
    .edit-btn {
      background-color: var(--cyan-600);
      color: white;
    }
    
    .edit-btn:hover {
      background-color: var(--cyan-700);
    }
    
    /* Card flip styling */
    .card-flip {
      height: 320px;
      perspective: 1000px;
    }
    
    .card-flip-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }
    
    .card-flip.flipped .card-flip-inner {
      transform: rotateY(180deg);
    }
    
    .card-flip-front, .card-flip-back {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }
    
    .card-flip-back {
      transform: rotateY(180deg);
    }
  `]
})
export class CompoundCardComponent {
  @Input() compound!: Compound;
  @Input() isInCompare: boolean = false;
  @Output() addToCompare = new EventEmitter<Compound>();
  
  isFlipped: boolean = false;
  
  get descriptionPreview(): string {
    if (!this.compound.description) return '';
    return this.compound.description.length > 150 
      ? `${this.compound.description.substring(0, 150)}...` 
      : this.compound.description;
  }
  
  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
  
  onAddToCompare() {
    if (!this.isInCompare) {
      this.addToCompare.emit(this.compound);
    }
  }
}