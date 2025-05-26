import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompoundService } from '../../services/compound.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="flex justify-between items-center py-4">
          <div class="logo" (click)="navigateToHome()">
            <h1>
              <span class="text-primary">Chem</span><span class="text-accent">Xplorer</span>
            </h1>
          </div>
          
          <div class="search-container">
            <form (submit)="search($event)">
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                name="search" 
                placeholder="Search compounds..." 
                class="search-input"
              />
              <button type="submit" class="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>
          
          <nav class="nav">
            <button class="nav-link" (click)="navigateToHome()">Home</button>
            <button class="nav-link" (click)="navigateToCreate()">Add New</button>
            <button class="nav-link" (click)="navigateToCompare()">
              Compare
              <span *ngIf="compareCount > 0" class="compare-badge">{{ compareCount }}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: white;
      box-shadow: var(--shadow);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .logo {
      cursor: pointer;
    }
    
    .logo h1 {
      font-size: 1.5rem;
      margin: 0;
    }
    
    .text-primary {
      color: var(--indigo-600);
      font-weight: 700;
    }
    
    .text-accent {
      color: var(--violet-600);
      font-weight: 700;
    }
    
    .search-container {
      position: relative;
      width: 100%;
      max-width: 400px;
      margin: 0 var(--spacing-4);
    }
    
    .search-input {
      width: 100%;
      padding: var(--spacing-2) var(--spacing-3);
      padding-right: var(--spacing-8);
      border: 2px solid var(--indigo-200);
      border-radius: var(--border-radius-lg);
      font-size: 0.9rem;
      transition: all var(--transition-fast) ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--indigo-400);
      box-shadow: 0 0 0 3px var(--indigo-100);
    }
    
    .search-button {
      position: absolute;
      right: var(--spacing-2);
      top: 50%;
      transform: translateY(-50%);
      padding: var(--spacing-1);
      color: var(--indigo-400);
      background: none;
      border: none;
      cursor: pointer;
      transition: color var(--transition-fast) ease;
    }
    
    .search-button:hover {
      color: var(--indigo-600);
    }
    
    .nav {
      display: flex;
      gap: var(--spacing-4);
    }
    
    .nav-link {
      position: relative;
      color: var(--neutral-700);
      font-weight: 500;
      padding: var(--spacing-2) var(--spacing-3);
      border-radius: var(--border-radius);
      transition: all var(--transition-fast) ease;
    }
    
    .nav-link:hover {
      background-color: var(--indigo-50);
      color: var(--indigo-700);
    }
    
    .compare-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: var(--violet-600);
      color: white;
      font-size: 0.7rem;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @media (max-width: 768px) {
      .search-container {
        order: 3;
        margin-top: var(--spacing-4);
        max-width: 100%;
      }
      
      .header .flex {
        flex-wrap: wrap;
      }
      
      .nav {
        gap: var(--spacing-2);
      }
      
      .nav-link {
        padding: var(--spacing-1) var(--spacing-2);
        font-size: 0.9rem;
      }
    }
  `]
})
export class HeaderComponent {
  searchTerm: string = '';
  compareCount: number = 0;
  
  constructor(
    private compoundService: CompoundService,
    private router: Router
  ) {
    this.compoundService.state$.subscribe(state => {
      this.compareCount = state.compareCompounds.length;
    });
  }
  
  navigateToHome() {
    this.router.navigate(['/']);
  }
  
  navigateToCreate() {
    this.router.navigate(['/compounds/create']);
  }
  
  navigateToCompare() {
    this.router.navigate(['/compounds/compare']);
  }
  
  search(event: Event) {
    event.preventDefault();
    if (this.searchTerm.trim()) {
      this.router.navigate(['/'], { 
        queryParams: { search: this.searchTerm.trim() } 
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}