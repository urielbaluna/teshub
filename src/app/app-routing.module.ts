import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecuperacionComponent } from './components/recuperacion/recuperacion.component';
import { LoginComponent } from './components/login/login.component';
import { ActualizarcontrasenaComponent } from './components/actualizarcontrasena/actualizarcontrasena.component';
import { ActualizardatosComponent } from './components/actualizardatos/actualizardatos.component';
import { CrearcuentaComponent } from './components/crearcuenta/crearcuenta.component';
import { CorreorecuperacionComponent} from './components/correorecuperacion/correorecuperacion.component';

 

const routes: Routes = [
  { path: 'recuperacion', component: RecuperacionComponent  },
  {path: 'login', component: LoginComponent },
  {path: 'actualizarcontrasena', component: ActualizarcontrasenaComponent },
  { path: 'actualizardatos', component: ActualizardatosComponent },
  {path: 'crearcuenta', component: CrearcuentaComponent },
  {path: 'correorecuperacion', component: CorreorecuperacionComponent },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }