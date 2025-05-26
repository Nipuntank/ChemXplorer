import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CompoundService } from '../../services/compound.service';
import { Compound } from '../../models/compound.model';

@Component({
  selector: 'app-compound-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-8">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading compound details...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error" class="alert alert-error">
        <p>{{ error }}</p>
        <button class="btn outline" routerLink="/">Back to Compounds</button>
      </div>
      
      <!-- Compound Details -->
      <div *ngIf="!loading && !error && compound" class="compound-details slide-up">
        <div class="back-link">
          <a routerLink="/" class="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Compounds
          </a>
        </div>
        
        <div class="detail-content">
          <div class="detail-image-container">
            <img [src]="compound.image" [alt]="compound.name" class="detail-image" />
          </div>
          
          <div class="detail-info">
            <h1 class="detail-title">{{ compound.name }}</h1>
            
            <div class="detail-metadata">
              <div class="metadata-item">
                <span class="metadata-label">ID:</span>
                <span class="metadata-value">{{ compound.id }}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Created:</span>
                <span class="metadata-value">{{ formatDate(compound.createdAt) }}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Last Updated:</span>
                <span class="metadata-value">{{ formatDate(compound.updatedAt) }}</span>
              </div>
            </div>
            
            <div class="description-section">
              <h3>Description</h3>
              <p class="description">{{ compound.description }}</p>
            </div>
            
            <div class="detail-actions">
              <button class="btn primary" [routerLink]="['/compounds', compound.id, 'edit']">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
                Edit
              </button>
              <button class="btn danger" (click)="confirmDelete()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  <line x1="10" x2="10" y1="11" y2="17"/>
                  <line x1="14" x2="14" y1="11" y2="17"/>
                </svg>
                Delete
              </button>
              <button class="btn accent" (click)="addToCompare()" [disabled]="isInCompare">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" x2="18" y1="20" y2="10"/>
                  <line x1="12" x2="12" y1="20" y2="4"/>
                  <line x1="6" x2="6" y1="20" y2="14"/>
                </svg>
                {{ isInCompare ? 'In Compare' : 'Add to Compare' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal" class="modal-overlay">
      <div class="modal-container scale-in">
        <div class="modal-header">
          <h3>Confirm Deletion</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ compound?.name }}</strong>?</p>
          <p class="modal-warning">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn outline" (click)="cancelDelete()">Cancel</button>
          <button class="btn danger" (click)="deleteCompound()" [disabled]="deleting">
            <span *ngIf="deleting">Deleting...</span>
            <span *ngIf="!deleting">Delete</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--neutral-200);
      border-top-color: var(--primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--spacing-4);
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
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
    
    .detail-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-8);
    }
    
    @media (min-width: 768px) {
      .detail-content {
        grid-template-columns: minmax(300px, 2fr) 3fr;
      }
    }
    
    .detail-image-container {
      position: relative;
      background-color: white;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    
    .detail-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform var(--transition-normal) ease;
    }
    
    .detail-image-container:hover .detail-image {
      transform: scale(1.05);
    }
    
    .detail-info {
      display: flex;
      flex-direction: column;
    }
    
    .detail-title {
      font-size: 2.5rem;
      color: var(--neutral-900);
      margin-bottom: var(--spacing-4);
      line-height: 1.2;
    }
    
    .detail-metadata {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-6);
      padding-bottom: var(--spacing-4);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .metadata-item {
      display: flex;
      flex-direction: column;
    }
    
    .metadata-label {
      font-size: 0.875rem;
      color: var(--neutral-500);
      margin-bottom: var(--spacing-1);
    }
    
    .metadata-value {
      font-weight: 500;
      color: var(--neutral-800);
    }
    
    .description-section {
      margin-bottom: var(--spacing-6);
    }
    
    .description-section h3 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-3);
      color: var(--neutral-800);
    }
    
    .description {
      line-height: 1.7;
      color: var(--neutral-700);
    }
    
    .detail-actions {
      display: flex;
      gap: var(--spacing-3);
      margin-top: auto;
      flex-wrap: wrap;
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
    
    .btn svg {
      flex-shrink: 0;
    }
    
    .btn.primary {
      background-color: var(--primary-600);
      color: white;
    }
    
    .btn.primary:hover {
      background-color: var(--primary-700);
    }
    
    .btn.danger {
      background-color: var(--error-500);
      color: white;
    }
    
    .btn.danger:hover {
      background-color: #dc2626;
    }
    
    .btn.accent {
      background-color: var(--accent-600);
      color: white;
    }
    
    .btn.accent:hover:not([disabled]) {
      background-color: var(--accent-700);
    }
    
    .btn.accent[disabled] {
      background-color: var(--accent-400);
      cursor: not-allowed;
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
    
    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }
    
    .modal-container {
      background-color: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      width: 90%;
      max-width: 500px;
      overflow: hidden;
    }
    
    .modal-header {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .modal-header h3 {
      margin: 0;
      color: var(--neutral-900);
    }
    
    .modal-body {
      padding: var(--spacing-6);
    }
    
    .modal-warning {
      color: var(--error-500);
      margin-top: var(--spacing-3);
      font-weight: 500;
    }
    
    .modal-footer {
      padding: var(--spacing-4);
      border-top: 1px solid var(--neutral-200);
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
    }
  `]
})
export class CompoundDetailComponent implements OnInit {
  compound: Compound | null = null;
  loading: boolean = true;
  error: string | null = null;
  showDeleteModal: boolean = false;
  deleting: boolean = false;
  isInCompare: boolean = false;
  
  constructor(
    private compoundService: CompoundService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadCompound(id);
      } else {
        this.error = 'Invalid compound ID';
        this.loading = false;
      }
    });
    
    this.compoundService.state$.subscribe(state => {
      if (this.compound) {
        this.isInCompare = state.compareCompounds.some(c => c.id === this.compound?.id);
      }
    });
  }
  
  loadCompound(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.compoundService.getCompoundById(id).subscribe({
      next: (compound) => {
        this.compound = compound;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load compound details. It may have been deleted or does not exist.';
        this.loading = false;
        console.error('Error fetching compound:', err);
      }
    });
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  addToCompare(): void {
    if (this.compound && !this.isInCompare) {
      this.compoundService.addToCompare(this.compound);
    }
  }
  
  confirmDelete(): void {
    this.showDeleteModal = true;
  }
  
  cancelDelete(): void {
    this.showDeleteModal = false;
  }
  
  deleteCompound(): void {
    if (!this.compound) return;
    
    this.deleting = true;
    
    this.compoundService.deleteCompound(this.compound.id).subscribe({
      next: () => {
        this.deleting = false;
        this.showDeleteModal = false;
        this.router.navigate(['/'], { 
          queryParams: { deleted: this.compound?.id }
        });
      },
      error: (err) => {
        this.deleting = false;
        this.error = 'Failed to delete compound. Please try again.';
        this.showDeleteModal = false;
        console.error('Error deleting compound:', err);
      }
    });
  }
}