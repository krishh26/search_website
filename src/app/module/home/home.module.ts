import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { RecourceSearchComponent } from './resource-search/resource-search.component';

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
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
