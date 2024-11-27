import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { TarjetaFormComponent } from './components/tarjeta-form/tarjeta-form/tarjeta-form.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { MovieListComponentsComponent } from './components/movie-list-components/movie-list-components.component';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ShowUsersComponent } from './components/show-users/show-users.component';
import { AlternativeOptionsComponent } from './components/alternative-options/alternative-options/alternative-options.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EntregasPendientesComponent } from './components/entregas-pendientes/entregas-pendientes.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    TarjetaFormComponent,
    FooterComponent,
    MovieListComponentsComponent,
    NavbarComponent,
    FavouriteListComponent,
    NotFoundComponent,
    ShowUsersComponent,
    AlternativeOptionsComponent,
    PerfilComponent,
    EntregasPendientesComponent,
    RecuperarContrasenaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
