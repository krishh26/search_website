import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { RecourceSearchComponent } from './resource-search/resource-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent
  },
  {
    path: "resource-search",
    component: RecourceSearchComponent
  }
]

@NgModule({
  declarations: [
    HomePageComponent,
    RecourceSearchComponent
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
