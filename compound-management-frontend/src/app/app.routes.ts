import { Routes } from '@angular/router';
import { CompoundListComponent } from './components/compound-list/compound-list.component';
import { CompoundDetailComponent } from './components/compound-detail/compound-detail.component';
import { CompoundEditComponent } from './components/compound-edit/compound-edit.component';
import { CompoundCompareComponent } from './components/compound-compare/compound-compare.component';

export const routes: Routes = [
  { path: '', component: CompoundListComponent },
  { path: 'compounds/create', component: CompoundEditComponent },
  { path: 'compounds/compare', component: CompoundCompareComponent },
  { path: 'compounds/:id', component: CompoundDetailComponent },
  { path: 'compounds/:id/edit', component: CompoundEditComponent },
  { path: '**', redirectTo: '' }
];