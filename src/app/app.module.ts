import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { BackToTopComponent } from './common/back-to-top/back-to-top.component';
import { HomeModule } from './module/home/home.module';
import { AboutUsModule } from './module/about-us/about-us.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ServiceTypeService } from './services/service-type.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BackToTopComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AppRoutingModule,
    HomeModule,
    AboutUsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ServiceTypeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
