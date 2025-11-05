import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperacionComponent } from './components/recuperacion/recuperacion.component';
import { ActualizarcontrasenaComponent } from './components/actualizarcontrasena/actualizarcontrasena.component';
import { ActualizardatosComponent } from './components/actualizardatos/actualizardatos.component';
import { CrearcuentaComponent } from './components/crearcuenta/crearcuenta.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CorreorecuperacionComponent } from './components/correorecuperacion/correorecuperacion.component';
import { HomeComponent } from './components/home/home.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { EditarPublicacionComponent } from './editar-publicacion/editar-publicacion.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecuperacionComponent,
    ActualizarcontrasenaComponent,
    ActualizardatosComponent,
    CrearcuentaComponent,
    CorreorecuperacionComponent,
    HomeComponent,
    CrearPublicacionComponent,
    PerfilComponent,
    EditarPublicacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }