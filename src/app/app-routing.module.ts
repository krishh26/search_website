import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./module/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./module/about-us/about-us.module').then(m => m.AboutUsModule)
  },
  {
    path: 'our-services',
    loadChildren: () => import('./module/our-services/our-services.module').then(m => m.OurServicesModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./module/contact-us/contact-us.module').then(m => m.ContactUsModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
