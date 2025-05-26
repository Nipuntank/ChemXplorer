import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { CompoundService } from '../../services/compound.service';
import { CompoundCardComponent } from '../compound-card/compound-card.component';
import { RecentlyViewedComponent } from '../recently-viewed/recently-viewed.component';
import { Compound, PaginationInfo } from '../../models/compound.model';

@Component({
  selector: 'app-compound-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CompoundCardComponent, RecentlyViewedComponent],
  template: `
    <div class="container py-8">
      <div class="header-section">
        <h1 class="main-title">Chemical Compounds</h1>
        <p class="subtitle">Explore our database of chemical compounds</p>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading compounds...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error" class="alert alert-error">
        <p>{{ error }}</p>
        <button class="retry-btn" (click)="loadCompounds()">Retry</button>
      </div>
      
      <!-- Recently Viewed Section -->
      <app-recently-viewed 
        *ngIf="recentlyViewed.length > 0"
        [compounds]="recentlyViewed"
        (addToCompare)="addToCompare($event)"
      ></app-recently-viewed>
      
      <!-- Main Compound Grid -->
      <div *ngIf="!loading && !error && compounds.length > 0" class="compound-grid">
        <app-compound-card 
          *ngFor="let compound of compounds" 
          [compound]="compound"
          [isInCompare]="isInCompare(compound.id)"
          (addToCompare)="addToCompare($event)"
          class="fade-in"
        ></app-compound-card>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="!loading && !error && compounds.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 2v7.31"></path>
            <path d="M14 9.3V1.99"></path>
            <path d="M8.5 2h7"></path>
            <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
            <path d="M5.58 16.5h12.85"></path>
          </svg>
        </div>
        <h3>No compounds found</h3>
        <p *ngIf="searchTerm">No compounds match your search: "{{ searchTerm }}"</p>
        <p *ngIf="!searchTerm">There are no compounds in the database</p>
        <div class="empty-actions">
          <button class="btn primary" (click)="clearSearch()" *ngIf="searchTerm">Clear Search</button>
          <button class="btn primary" routerLink="/compounds/create">Add Compound</button>
        </div>
      </div>
      
      <!-- Pagination -->
      <div *ngIf="!loading && !error && compounds.length > 0" class="pagination">
        <button 
          class="pagination-btn" 
          [disabled]="pagination.currentPage === 1"
          (click)="changePage(pagination.currentPage - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Previous
        </button>
        
        <div class="pagination-info">
          <span>Page {{ pagination.currentPage }} of {{ pagination.totalPages }}</span>
          <span class="pagination-count">{{ pagination.totalItems }} compounds</span>
        </div>
        
        <button 
          class="pagination-btn" 
          [disabled]="pagination.currentPage === pagination.totalPages"
          (click)="changePage(pagination.currentPage + 1)"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .header-section {
      text-align: center;
      margin-bottom: var(--spacing-8);
    }
    
    .main-title {
      font-size: 2.5rem;
      color: var(--primary-800);
      margin-bottom: var(--spacing-2);
    }
    
    .subtitle {
      font-size: 1.1rem;
      color: var(--neutral-600);
    }
    
    .compound-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }
    
    @media (min-width: 640px) {
      .compound-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 960px) {
      .compound-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (min-width: 1280px) {
      .compound-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
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
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8) 0;
      text-align: center;
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
    }
    
    .empty-actions {
      display: flex;
      gap: var(--spacing-4);
    }
    
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--spacing-8);
    }
    
    .pagination-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      padding: var(--spacing-2) var(--spacing-3);
      background-color: white;
      border: 1px solid var(--neutral-300);
      border-radius: var(--border-radius);
      font-weight: 500;
      color: var(--neutral-800);
      transition: all var(--transition-fast) ease;
    }
    
    .pagination-btn:hover:not([disabled]) {
      background-color: var(--neutral-100);
      border-color: var(--neutral-400);
    }
    
    .pagination-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .pagination-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-1);
    }
    
    .pagination-count {
      font-size: 0.85rem;
      color: var(--neutral-500);
    }
    
    .btn {
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--border-radius);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast) ease;
    }
    
    .btn.primary {
      background-color: var(--primary-600);
      color: white;
    }
    
    .btn.primary:hover {
      background-color: var(--primary-700);
    }
    
    .retry-btn {
      display: inline-block;
      margin-top: var(--spacing-2);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--border-radius);
      background-color: white;
      border: 1px solid var(--error-500);
      color: var(--error-500);
      font-weight: 500;
      transition: all var(--transition-fast) ease;
    }
    
    .retry-btn:hover {
      background-color: var(--error-500);
      color: white;
    }
  `]
})
export class CompoundListComponent implements OnInit {
  compounds: Compound[] = [];
  pagination: PaginationInfo = {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10
  };
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  recentlyViewed: Compound[] = [];
  compareCompounds: Compound[] = [];
  
  constructor(
    private compoundService: CompoundService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Subscribe to query parameters for search
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.loadCompounds();
    });
    
    // Subscribe to state changes
    this.compoundService.state$.subscribe(state => {
      this.recentlyViewed = state.recentlyViewed;
      this.compareCompounds = state.compareCompounds;
    });
  }
  
  loadCompounds() {
    this.loading = true;
    this.error = null;
    
    this.compoundService.getCompounds(
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.searchTerm
    ).subscribe({
      next: (response) => {
        this.compounds = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load compounds. Please try again.';
        this.loading = false;
        console.error('Error fetching compounds:', err);
      }
    });
  }
  
  changePage(page: number) {
    if (page < 1 || page > this.pagination.totalPages) {
      return;
    }
    
    this.pagination.currentPage = page;
    
    // Update URL with current page
    const queryParams: any = { page };
    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
    
    this.loadCompounds();
    
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  clearSearch() {
    this.searchTerm = '';
    this.router.navigate(['/']);
  }
  
  isInCompare(id: number): boolean {
    return this.compareCompounds.some(c => c.id === id);
  }
  
  addToCompare(compound: Compound) {
    this.compoundService.addToCompare(compound);
  }
}