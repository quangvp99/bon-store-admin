import { Routes } from '@angular/router';
import { ListCategoryComponent } from './categories/list-category/list-category.component';
import { ListProductComponent } from './products/list-product/list-product.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';

export const AdministrationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'categories',
        component: ListCategoryComponent,
      },
      {
        path: 'products',
        component: ListProductComponent,
      },
      {
        path: 'product/create',
        component: CreateProductComponent,
      },
      {
        path: 'product/:id',
        component: EditProductComponent,
      },
    ],
  },
];
