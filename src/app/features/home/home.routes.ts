import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ItemDetailComponent } from '../items/components/item-detail/item-detail';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'items/:id',
    component: ItemDetailComponent,
  },
];
