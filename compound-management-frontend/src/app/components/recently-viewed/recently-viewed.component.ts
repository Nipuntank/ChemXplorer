import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Compound } from '../../models/compound.model';

@Component({
  selector: 'app-recently-viewed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="recently-viewed-section">
      <div class="section-header">
        <h2>Recently Viewed</h2>
      </div>
      
      <div class="recently-viewed-carousel">
        <div class="carousel-container">
          <div class="carousel-track" [style.transform]="'translateX(' + translateX + 'px)'">
            <div *ngFor="let compound of compounds" class="carousel-item">
              <div class="recent-card" [routerLink]="['/compounds', compound.id]">
                <div class="recent-image">
                  <img [src]="compound.image" [alt]="compound.name" />
                </div>
                <div class="recent-info">
                  <h3>{{ compound.name }}</h3>
                  <button class="compare-btn" (click)="onAddToCompare($event, compound)">
                    Compare
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          *ngIf="canScrollLeft" 
          class="carousel-control left-control" 
          (click)="scrollLeft()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        
        <button 
          *ngIf="canScrollRight" 
          class="carousel-control right-control" 
          (click)="scrollRight()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .recently-viewed-section {
      margin-bottom: var(--spacing-8);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
    }
    
    .section-header h2 {
      font-size: 1.5rem;
      color: var(--neutral-800);
      margin: 0;
    }
    
    .recently-viewed-carousel {
      position: relative;
    }
    
    .carousel-container {
      overflow: hidden;
      margin: 0 -8px;
    }
    
    .carousel-track {
      display: flex;
      transition: transform 0.5s ease;
    }
    
    .carousel-item {
      flex: 0 0 auto;
      width: 100%;
      max-width: 200px;
      padding: 0 8px;
    }
    
    @media (min-width: 640px) {
      .carousel-item {
        width: 50%;
      }
    }
    
    @media (min-width: 768px) {
      .carousel-item {
        width: 33.333%;
      }
    }
    
    @media (min-width: 1024px) {
      .carousel-item {
        width: 25%;
      }
    }
    
    @media (min-width: 1280px) {
      .carousel-item {
        width: 20%;
      }
    }
    
    .recent-card {
      background-color: white;
      border-radius: var(--border-radius-md);
      overflow: hidden;
      box-shadow: var(--shadow);
      cursor: pointer;
      transition: transform var(--transition-normal) ease, box-shadow var(--transition-normal) ease;
      height: 100%;
    }
    
    .recent-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }
    
    .recent-image {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--neutral-100);
      overflow: hidden;
    }
    
    .recent-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform var(--transition-normal) ease;
    }
    
    .recent-card:hover .recent-image img {
      transform: scale(1.05);
    }
    
    .recent-info {
      padding: var(--spacing-3);
    }
    
    .recent-info h3 {
      margin: 0;
      margin-bottom: var(--spacing-2);
      font-size: 0.9rem;
      color: var(--neutral-800);
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .compare-btn {
      width: 100%;
      padding: var(--spacing-1) var(--spacing-2);
      font-size: 0.8rem;
      text-align: center;
      border-radius: var(--border-radius);
      background-color: var(--accent-600);
      color: white;
      transition: background-color var(--transition-fast) ease;
    }
    
    .compare-btn:hover {
      background-color: var(--accent-700);
    }
    
    .carousel-control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: white;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      transition: all var(--transition-fast) ease;
    }
    
    .carousel-control:hover {
      background-color: var(--primary-50);
      color: var(--primary-600);
    }
    
    .left-control {
      left: -20px;
    }
    
    .right-control {
      right: -20px;
    }
  `]
})
export class RecentlyViewedComponent {
  @Input() compounds: Compound[] = [];
  @Output() addToCompare = new EventEmitter<Compound>();
  
  translateX: number = 0;
  itemWidth: number = 200; // Width of each item plus padding
  scrollAmount: number = 0;
  
  get canScrollLeft(): boolean {
    return this.translateX < 0;
  }
  
  get canScrollRight(): boolean {
    // Calculate total width of all items
    const totalWidth = this.compounds.length * this.itemWidth;
    // Get the visible width of the carousel container
    const containerWidth = window.innerWidth - 40; // Adjust based on container padding
    // Determine if there are more items to scroll to
    return Math.abs(this.translateX) + containerWidth < totalWidth;
  }
  
  ngOnInit() {
    // Update scroll amount based on window width
    this.updateScrollAmount();
    window.addEventListener('resize', this.updateScrollAmount.bind(this));
  }
  
  ngOnDestroy() {
    window.removeEventListener('resize', this.updateScrollAmount.bind(this));
  }
  
  updateScrollAmount() {
    const width = window.innerWidth;
    
    if (width < 640) {
      this.scrollAmount = 1; // Scroll 1 item on mobile
    } else if (width < 768) {
      this.scrollAmount = 2; // Scroll 2 items on small tablets
    } else if (width < 1024) {
      this.scrollAmount = 3; // Scroll 3 items on tablets
    } else if (width < 1280) {
      this.scrollAmount = 4; // Scroll 4 items on laptops
    } else {
      this.scrollAmount = 5; // Scroll 5 items on large screens
    }
  }
  
  scrollLeft() {
    // Calculate new translateX
    const newTranslateX = Math.min(0, this.translateX + (this.itemWidth * this.scrollAmount));
    this.translateX = newTranslateX;
  }
  
  scrollRight() {
    // Calculate new translateX
    const containerWidth = window.innerWidth - 40;
    const totalWidth = this.compounds.length * this.itemWidth;
    const maxTranslateX = -(totalWidth - containerWidth);
    
    const newTranslateX = Math.max(maxTranslateX, this.translateX - (this.itemWidth * this.scrollAmount));
    this.translateX = newTranslateX;
  }
  
  onAddToCompare(event: Event, compound: Compound) {
    event.stopPropagation(); // Prevent navigation to detail page
    this.addToCompare.emit(compound);
  }
}