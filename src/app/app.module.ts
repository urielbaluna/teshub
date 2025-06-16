import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperacionComponent } from './components/recuperacion/recuperacion.component';
import { CrearcuentaComponent } from './components/crearcuenta/crearcuenta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecuperacionComponent,
    CrearcuentaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
