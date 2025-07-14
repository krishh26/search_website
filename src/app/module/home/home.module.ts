import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { RecourceSearchComponent } from './resource-search/resource-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent
  },
  {
    path: "resource-search",
    component: RecourceSearchComponent
  },
  {
    path: "cart-item",
    component: CartComponent
  }
]

@NgModule({
  declarations: [
    HomePageComponent,
    RecourceSearchComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgSelectModule
  ]
})
export class HomeModule { }
