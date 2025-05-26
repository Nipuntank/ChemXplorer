import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Compound, CompoundResponse, CompoundState, PaginationInfo } from '../models/compound.model';

@Injectable({
  providedIn: 'root'
})
export class CompoundService {
  private apiUrl = 'http://localhost:3000/api/compounds';
  
  private initialState: CompoundState = {
    loading: false,
    error: null,
    compounds: [],
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10
    },
    selectedCompound: null,
    recentlyViewed: [],
    compareCompounds: []
  };
  
  private state = new BehaviorSubject<CompoundState>(this.initialState);
  
  constructor(private http: HttpClient) {
    // Load recently viewed from localStorage on initialization
    const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (savedRecentlyViewed) {
      try {
        const recentlyViewed = JSON.parse(savedRecentlyViewed);
        this.setState({ recentlyViewed });
      } catch (e) {
        localStorage.removeItem('recentlyViewed');
      }
    }
  }
  
  // State management
  private setState(newState: Partial<CompoundState>) {
    this.state.next({
      ...this.state.value,
      ...newState
    });
  }
  
  get state$(): Observable<CompoundState> {
    return this.state.asObservable();
  }
  
  // API methods
  getCompounds(page: number = 1, limit: number = 10, search: string = ''): Observable<CompoundResponse> {
    this.setState({ loading: true, error: null });
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    if (search) {
      params = params.set('search', search);
    }
    
    return this.http.get<CompoundResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        this.setState({
          loading: false,
          compounds: response.data,
          pagination: response.pagination
        });
      }),
      catchError(error => {
        this.setState({
          loading: false,
          error: error.message || 'Failed to fetch compounds'
        });
        return throwError(() => error);
      })
    );
  }
  
  getCompoundById(id: number): Observable<Compound> {
    this.setState({ loading: true, error: null });
    
    return this.http.get<Compound>(`${this.apiUrl}/${id}`).pipe(
      tap(compound => {
        this.setState({
          loading: false,
          selectedCompound: compound
        });
        this.addToRecentlyViewed(compound);
      }),
      catchError(error => {
        this.setState({
          loading: false,
          error: error.message || `Failed to fetch compound with ID ${id}`
        });
        return throwError(() => error);
      })
    );
  }
  
  createCompound(compound: Omit<Compound, 'id' | 'createdAt' | 'updatedAt'>): Observable<Compound> {
    this.setState({ loading: true, error: null });
    
    return this.http.post<Compound>(this.apiUrl, compound).pipe(
      tap(newCompound => {
        this.setState({
          loading: false,
          compounds: [newCompound, ...this.state.value.compounds]
        });
      }),
      catchError(error => {
        this.setState({
          loading: false,
          error: error.message || 'Failed to create compound'
        });
        return throwError(() => error);
      })
    );
  }
  
  updateCompound(id: number, compound: Partial<Compound>): Observable<Compound> {
    this.setState({ loading: true, error: null });
    
    return this.http.put<Compound>(`${this.apiUrl}/${id}`, compound).pipe(
      tap(updatedCompound => {
        const compounds = this.state.value.compounds.map(c => 
          c.id === updatedCompound.id ? updatedCompound : c
        );
        
        this.setState({
          loading: false,
          compounds,
          selectedCompound: updatedCompound
        });
        
        // Update in recently viewed if it exists there
        const recentlyViewed = this.state.value.recentlyViewed.map(c => 
          c.id === updatedCompound.id ? updatedCompound : c
        );
        
        this.setState({ recentlyViewed });
        this.saveRecentlyViewedToLocalStorage();
      }),
      catchError(error => {
        this.setState({
          loading: false,
          error: error.message || `Failed to update compound with ID ${id}`
        });
        return throwError(() => error);
      })
    );
  }
  
  deleteCompound(id: number): Observable<void> {
    this.setState({ loading: true, error: null });
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const compounds = this.state.value.compounds.filter(c => c.id !== id);
        const recentlyViewed = this.state.value.recentlyViewed.filter(c => c.id !== id);
        const compareCompounds = this.state.value.compareCompounds.filter(c => c.id !== id);
        
        this.setState({
          loading: false,
          compounds,
          recentlyViewed,
          compareCompounds
        });
        
        this.saveRecentlyViewedToLocalStorage();
      }),
      catchError(error => {
        this.setState({
          loading: false,
          error: error.message || `Failed to delete compound with ID ${id}`
        });
        return throwError(() => error);
      })
    );
  }
  
  // Recently viewed management
  private addToRecentlyViewed(compound: Compound) {
    // Remove if already exists
    let recentlyViewed = this.state.value.recentlyViewed.filter(c => c.id !== compound.id);
    
    // Add to beginning of array
    recentlyViewed = [compound, ...recentlyViewed];
    
    // Limit to 10 most recent
    if (recentlyViewed.length > 10) {
      recentlyViewed = recentlyViewed.slice(0, 10);
    }
    
    this.setState({ recentlyViewed });
    this.saveRecentlyViewedToLocalStorage();
  }
  
  private saveRecentlyViewedToLocalStorage() {
    localStorage.setItem('recentlyViewed', JSON.stringify(this.state.value.recentlyViewed));
  }
  
  // Comparison functionality
  addToCompare(compound: Compound): void {
    if (this.state.value.compareCompounds.length >= 3) {
      return; // Limit to 3 compounds for comparison
    }
    
    if (!this.state.value.compareCompounds.some(c => c.id === compound.id)) {
      const compareCompounds = [...this.state.value.compareCompounds, compound];
      this.setState({ compareCompounds });
    }
  }
  
  removeFromCompare(id: number): void {
    const compareCompounds = this.state.value.compareCompounds.filter(c => c.id !== id);
    this.setState({ compareCompounds });
  }
  
  clearCompare(): void {
    this.setState({ compareCompounds: [] });
  }
}