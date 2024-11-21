import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { TarjetaFormComponent } from './components/tarjeta-form/tarjeta-form/tarjeta-form.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    TarjetaFormComponent,
    FooterComponent,
    MovieListComponent,
    NavbarComponent,
    FavouriteListComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
