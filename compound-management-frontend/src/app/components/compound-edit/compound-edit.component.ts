import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompoundService } from '../../services/compound.service';
import { Compound } from '../../models/compound.model';

@Component({
  selector: 'app-compound-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-8">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading compound data...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error" class="alert alert-error">
        <p>{{ error }}</p>
        <button class="btn outline" routerLink="/">Back to Compounds</button>
      </div>
      
      <div *ngIf="!loading && !error" class="edit-container slide-up">
        <div class="back-link">
          <a routerLink="/compounds/{{ isEditing ? compoundForm.id : '' }}" class="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            {{ isEditing ? 'Back to Compound Details' : 'Back to Compounds' }}
          </a>
        </div>
        
        <h1 class="edit-title">{{ isEditing ? 'Edit Compound' : 'Add New Compound' }}</h1>
        
        <!-- Success Message -->
        <div *ngIf="successMessage" class="alert alert-success">
          <p>{{ successMessage }}</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #form="ngForm" class="edit-form">
          <div class="form-grid">
            <div class="form-section">
              <div class="form-group">
                <label for="name">Compound Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  [(ngModel)]="compoundForm.name" 
                  required 
                  class="form-control"
                  #nameInput="ngModel"
                >
                <div *ngIf="nameInput.invalid && (nameInput.dirty || nameInput.touched)" class="error-message">
                  Name is required
                </div>
              </div>
              
              <div class="form-group">
                <label for="image">Image URL</label>
                <input 
                  type="url" 
                  id="image" 
                  name="image" 
                  [(ngModel)]="compoundForm.image" 
                  required 
                  class="form-control"
                  #imageInput="ngModel"
                >
                <div *ngIf="imageInput.invalid && (imageInput.dirty || imageInput.touched)" class="error-message">
                  Valid image URL is required
                </div>
              </div>
              
              <div class="form-group image-preview-container">
                <label>Image Preview</label>
                <div class="image-preview">
                  <img 
                    *ngIf="compoundForm.image" 
                    [src]="compoundForm.image" 
                    alt="Compound preview" 
                    (error)="handleImageError()"
                  />
                  <div *ngIf="!compoundForm.image || imageError" class="no-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                    <span>{{ imageError ? 'Invalid image URL' : 'No image provided' }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <div class="form-group">
                <label for="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  [(ngModel)]="compoundForm.description" 
                  required 
                  class="form-control textarea"
                  rows="10"
                  #descriptionInput="ngModel"
                ></textarea>
                <div *ngIf="descriptionInput.invalid && (descriptionInput.dirty || descriptionInput.touched)" class="error-message">
                  Description is required
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn outline" (click)="cancel()">Cancel</button>
            <button 
              type="submit" 
              class="btn primary" 
              [disabled]="form.invalid || submitting || imageError"
            >
              <span *ngIf="submitting">
                <svg class="spinner-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" />
                </svg>
                Saving...
              </span>
              <span *ngIf="!submitting">{{ isEditing ? 'Update Compound' : 'Create Compound' }}</span>
            </button>
          </div>
        </form>
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
    
    .edit-title {
      font-size: 2rem;
      color: var(--neutral-900);
      margin-bottom: var(--spacing-6);
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-6);
    }
    
    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    .form-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group label {
      font-weight: 500;
      margin-bottom: var(--spacing-2);
      color: var(--neutral-700);
    }
    
    .form-control {
      padding: var(--spacing-3);
      border: 1px solid var(--neutral-300);
      border-radius: var(--border-radius);
      font-size: 1rem;
      transition: all var(--transition-fast) ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-control.textarea {
      min-height: 200px;
      resize: vertical;
    }
    
    .error-message {
      color: var(--error-500);
      font-size: 0.875rem;
      margin-top: var(--spacing-1);
    }
    
    .image-preview-container {
      margin-top: var(--spacing-2);
    }
    
    .image-preview {
      width: 100%;
      height: 200px;
      border: 1px solid var(--neutral-300);
      border-radius: var(--border-radius);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--neutral-100);
    }
    
    .image-preview img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .no-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--neutral-500);
    }
    
    .no-image svg {
      margin-bottom: var(--spacing-2);
      opacity: 0.5;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-4);
      margin-top: var(--spacing-6);
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-6);
      border-radius: var(--border-radius);
      font-weight: 500;
      transition: all var(--transition-fast) ease;
    }
    
    .btn.primary {
      background-color: var(--primary-600);
      color: white;
    }
    
    .btn.primary:hover:not([disabled]) {
      background-color: var(--primary-700);
    }
    
    .btn.primary[disabled] {
      background-color: var(--primary-400);
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
    
    .spinner-icon {
      width: 18px;
      height: 18px;
      animation: spin 1s linear infinite;
      stroke-dasharray: 60;
      stroke-dashoffset: 50;
    }
  `]
})
export class CompoundEditComponent implements OnInit {
  isEditing: boolean = false;
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  submitting: boolean = false;
  imageError: boolean = false;
  
  compoundForm: Partial<Compound> = {
    id: 0,
    name: '',
    image: '',
    description: ''
  };
  
  constructor(
    private compoundService: CompoundService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id && id !== 'create') {
        this.isEditing = true;
        this.loadCompound(Number(id));
      } else {
        this.isEditing = false;
        this.loading = false;
      }
    });
  }
  
  loadCompound(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.compoundService.getCompoundById(id).subscribe({
      next: (compound) => {
        this.compoundForm = { ...compound };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load compound data. It may have been deleted or does not exist.';
        this.loading = false;
        console.error('Error fetching compound:', err);
      }
    });
  }
  
  handleImageError(): void {
    this.imageError = true;
  }
  
  onSubmit(): void {
    if (this.imageError) return;
    
    this.submitting = true;
    this.error = null;
    this.successMessage = null;
    
    if (this.isEditing) {
      this.updateCompound();
    } else {
      this.createCompound();
    }
  }
  
  updateCompound(): void {
    if (!this.compoundForm.id) return;
    
    const { id, ...updateData } = this.compoundForm;
    
    this.compoundService.updateCompound(id, updateData).subscribe({
      next: (compound) => {
        this.submitting = false;
        this.successMessage = `${compound.name} has been updated successfully.`;
        setTimeout(() => {
          this.router.navigate(['/compounds', compound.id]);
        }, 1500);
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Failed to update compound. Please try again.';
        console.error('Error updating compound:', err);
      }
    });
  }
  
  createCompound(): void {
    if (!this.compoundForm.name || !this.compoundForm.image || !this.compoundForm.description) {
      this.error = 'Please fill in all required fields.';
      this.submitting = false;
      return;
    }
    
    const newCompound = {
      name: this.compoundForm.name,
      image: this.compoundForm.image,
      description: this.compoundForm.description
    };
    
    this.compoundService.createCompound(newCompound).subscribe({
      next: (compound) => {
        this.submitting = false;
        this.successMessage = `${compound.name} has been created successfully.`;
        setTimeout(() => {
          this.router.navigate(['/compounds', compound.id]);
        }, 1500);
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Failed to create compound. Please try again.';
        console.error('Error creating compound:', err);
      }
    });
  }
  
  cancel(): void {
    if (this.isEditing && this.compoundForm.id) {
      this.router.navigate(['/compounds', this.compoundForm.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
}