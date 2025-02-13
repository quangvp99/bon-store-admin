import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { AdministrationRoutes } from './administration.routing';

import { MatNativeDateModule } from '@angular/material/core';
import { ListCategoryComponent } from './categories/list-category/list-category.component';
import { CreateCategoryComponent } from './categories/create-category/create-category.component';
import { ListProductComponent } from './products/list-product/list-product.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdministrationRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    CKEditorModule
  ],
  declarations: [
    ListCategoryComponent,
    CreateCategoryComponent,
    ListProductComponent,
    CreateProductComponent,
    EditProductComponent
  ],
})
export class AdministrationModule {}
