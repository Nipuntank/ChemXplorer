import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompoundService } from '../../services/compound.service';
import { Compound } from '../../models/compound.model';

@Component({
  selector: 'app-compound-compare',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-8">
      <div class="back-link">
        <a routerLink="/" class="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Compounds
        </a>
      </div>
      
      <h1 class="compare-title">Compare Compounds</h1>
      
      <!-- Empty State -->
      <div *ngIf="compounds.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h3>No Compounds to Compare</h3>
        <p>Add up to 3 compounds to compare their properties side by side.</p>
        <button class="btn primary" routerLink="/">Browse Compounds</button>
      </div>
      
      <!-- Compare Table -->
      <div *ngIf="compounds.length > 0" class="compare-table-container scale-in">
        <div class="compare-actions">
          <button class="btn outline" (click)="clearAll()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Clear All
          </button>
        </div>
        
        <div class="compare-table">
          <!-- Header Row -->
          <div class="compare-row header-row">
            <div class="compare-cell property-cell">Property</div>
            <div class="compare-cell" *ngFor="let compound of compounds">
              <div class="compound-header">
                <img [src]="compound.image" [alt]="compound.name" class="compound-thumb" />
                <h3>{{ compound.name }}</h3>
                <button class="remove-btn" (click)="removeCompound(compound.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            <!-- Empty cells to fill the table -->
            <div class="compare-cell empty-cell" *ngFor="let _ of emptySlots">
              <div class="empty-compound">
                <div class="empty-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </div>
                <p>Add Compound</p>
              </div>
            </div>
          </div>
          
          <!-- ID Row -->
          <div class="compare-row">
            <div class="compare-cell property-cell">ID</div>
            <div class="compare-cell" *ngFor="let compound of compounds">
              {{ compound.id }}
            </div>
            <div class="compare-cell empty-cell" *ngFor="let _ of emptySlots"></div>
          </div>
          
          <!-- Image Row -->
          <div class="compare-row image-row">
            <div class="compare-cell property-cell">Image</div>
            <div class="compare-cell" *ngFor="let compound of compounds">
              <div class="compare-image-container">
                <img [src]="compound.image" [alt]="compound.name" class="compare-image" />
              </div>
            </div>
            <div class="compare-cell empty-cell" *ngFor="let _ of emptySlots"></div>
          </div>
          
          <!-- Description Row -->
          <div class="compare-row">
            <div class="compare-cell property-cell">Description</div>
            <div class="compare-cell" *ngFor="let compound of compounds">
              <p class="description-text">{{ compound.description }}</p>
            </div>
            <div class="compare-cell empty-cell" *ngFor="let _ of emptySlots"></div>
          </div>
          
          <!-- Created Date Row -->
          <div class="compare-row">
            <div class="compare-cell property-cell">Created</div>
            <div class="compare-cell" *ngFor="let compound of compounds">
              {{ formatDate(compound.createdAt) }}
            </div>
            <div class="compare-cell empty-cell" *ngFor="let _ of emptySlots"></div>
          </div>
          
          <!-- Updated Date Row -->
          <div class="compare-row">
            <div class="compare-cell property-cell">Last Updated</div>
            <div class="compare-cell" *ngFor="let compound of compounds">
              {{ formatDate(compound.updatedAt) }}
            </div>
            <div class="compare-cell empty-cell" *ngFor="let _ of emptySlots"></div>
          </div>
          
          <!-- Actions Row -->
          <div class="compare-row actions-row">
            <div class="compare-cell property-cell">Actions</div>
            <div class="compare-cell" *ngFor="let compound of compounds">
              <div class="action-buttons">
                <button class="btn-small primary" [routerLink]="['/compounds', compound.id]">View</button>
                <button class="btn-small secondary" [routerLink]="['/compounds', compound.id, 'edit']">Edit</button>
              </div>
            </div>
            <div class="compare-cell empty-cell" *ngFor="let _ of emptySlots"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .back-link {
      margin-bottom: var(--spacing-6);
    }
    
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      color: var(--neutral-600);
      transition: color var(--transition-fast) ease;
      border-radius: var(--border-radius);
    }
    
    .back-btn:hover {
      color: var(--primary-600);
      background-color: var(--neutral-100);
    }
    
    .compare-title {
      font-size: 2rem;
      color: var(--neutral-900);
      margin-bottom: var(--spacing-6);
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8) 0;
      text-align: center;
      background-color: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
    }
    
    .empty-icon {
      color: var(--neutral-400);
      margin-bottom: var(--spacing-4);
    }
    
    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: var(--spacing-2);
      color: var(--neutral-700);
    }
    
    .empty-state p {
      color: var(--neutral-600);
      margin-bottom: var(--spacing-6);
      max-width: 400px;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--border-radius);
      font-weight: 500;
      transition: all var(--transition-fast) ease;
    }
    
    .btn.primary {
      background-color: var(--primary-600);
      color: white;
    }
    
    .btn.primary:hover {
      background-color: var(--primary-700);
    }
    
    .btn.outline {
      background-color: transparent;
      border: 1px solid var(--neutral-300);
      color: var(--neutral-700);
    }
    
    .btn.outline:hover {
      background-color: var(--neutral-100);
      border-color: var(--neutral-400);
    }
    
    .compare-table-container {
      background-color: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    
    .compare-actions {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--neutral-200);
      display: flex;
      justify-content: flex-end;
    }
    
    .compare-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .compare-row {
      display: grid;
      grid-template-columns: 150px repeat(auto-fit, minmax(200px, 1fr));
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .compare-row:last-child {
      border-bottom: none;
    }
    
    .compare-cell {
      padding: var(--spacing-4);
      min-width: 0;
    }
    
    .property-cell {
      font-weight: 600;
      background-color: var(--neutral-50);
      color: var(--neutral-700);
      display: flex;
      align-items: center;
    }
    
    .header-row {
      background-color: var(--neutral-100);
      position: sticky;
      top: 0;
      z-index: 1;
    }
    
    .compound-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
    }
    
    .compound-thumb {
      width: 60px;
      height: 60px;
      object-fit: contain;
      margin-bottom: var(--spacing-2);
      background-color: var(--neutral-50);
      border-radius: var(--border-radius);
      padding: var(--spacing-1);
    }
    
    .compound-header h3 {
      font-size: 1rem;
      margin: 0;
      line-height: 1.3;
    }
    
    .remove-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: var(--neutral-200);
      color: var(--neutral-700);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast) ease;
      padding: 0;
    }
    
    .remove-btn:hover {
      background-color: var(--error-500);
      color: white;
    }
    
    .compare-image-container {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .compare-image {
      max-width: 100%;
      max-height: 150px;
      object-fit: contain;
    }
    
    .empty-cell {
      background-color: var(--neutral-50);
    }
    
    .empty-compound {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--neutral-400);
    }
    
    .empty-placeholder {
      width: 40px;
      height: 40px;
      background-color: var(--neutral-200);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-2);
    }
    
    .description-text {
      max-height: 150px;
      overflow-y: auto;
      margin: 0;
      line-height: 1.5;
    }
    
    .actions-row {
      background-color: var(--neutral-50);
    }
    
    .action-buttons {
      display: flex;
      gap: var(--spacing-2);
      justify-content: center;
    }
    
    .btn-small {
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition-fast) ease;
    }
    
    .btn-small.primary {
      background-color: var(--primary-600);
      color: white;
    }
    
    .btn-small.primary:hover {
      background-color: var(--primary-700);
    }
    
    .btn-small.secondary {
      background-color: var(--secondary-600);
      color: white;
    }
    
    .btn-small.secondary:hover {
      background-color: var(--secondary-700);
    }
    
    @media (max-width: 768px) {
      .compare-row {
        grid-template-columns: 100px repeat(auto-fit, minmax(150px, 1fr));
      }
      
      .compare-cell {
        padding: var(--spacing-2);
        font-size: 0.875rem;
      }
      
      .compare-image-container {
        height: 100px;
      }
      
      .compare-image {
        max-height: 100px;
      }
      
      .description-text {
        max-height: 100px;
      }
    }
  `]
})
export class CompoundCompareComponent implements OnInit {
  compounds: Compound[] = [];
  maxCompounds = 3;
  
  get emptySlots() {
    const emptyCount = this.maxCompounds - this.compounds.length;
    return emptyCount > 0 ? new Array(emptyCount).fill(null) : [];
  }
  
  constructor(private compoundService: CompoundService) {}
  
  ngOnInit(): void {
    this.compoundService.state$.subscribe(state => {
      this.compounds = state.compareCompounds;
    });
  }
  
  removeCompound(id: number): void {
    this.compoundService.removeFromCompare(id);
  }
  
  clearAll(): void {
    this.compoundService.clearCompare();
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}