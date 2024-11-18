import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register/register.component';
import { TarjetaFormComponent } from './components/tarjeta-form/tarjeta-form/tarjeta-form.component';
import { FooterComponent } from './components/footer/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    TarjetaFormComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
