import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-register',
  
  templateUrl: './crearcuenta.component.html',
  styleUrls: ['./crearcuenta.component.css']
})
export class CrearcuentaComponent {
  matricula = '';
  nombre = '';
  apellidos = '';
  correo = '';
  contrasena = '';

  onSubmit() {
    console.log('Formulario enviado');
    console.log({
      matricula: this.matricula,
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      contrasena: this.contrasena
    });
  }
}
