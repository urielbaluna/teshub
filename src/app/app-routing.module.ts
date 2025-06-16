import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearcuentaComponent } from './components/crearcuenta/crearcuenta.component';

const routes: Routes = [
  { path: 'crearcuenta', component: CrearcuentaComponent },
  { path: '', redirectTo: 'crearcuenta', pathMatch: 'full' } // redirige a crearcuenta por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }