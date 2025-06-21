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




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecuperacionComponent,
    ActualizarcontrasenaComponent,
    ActualizardatosComponent,
    CrearcuentaComponent,
    
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
