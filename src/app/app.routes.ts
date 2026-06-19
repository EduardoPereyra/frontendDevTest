import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Mobile Store',
    loadComponent: () =>
      import('./features/product-list/product-list.component').then(
        (module) => module.ProductListComponent,
      ),
  },
  {
    path: 'product/:id',
    title: 'Product detail | Mobile Store',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component').then(
        (module) => module.ProductDetailComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
