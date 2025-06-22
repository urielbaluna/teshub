import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-actualizarcontrasena',
  templateUrl: './actualizarcontrasena.component.html',
  styleUrls: ['./actualizarcontrasena.component.css']
})
export class ActualizarcontrasenaComponent {
  codigo: string = '';
  contrasena1: string = '';
  contrasena2: string = '';
  mensaje: string = '';
  correo: string = '';

  constructor(private http: HttpClient) {
    this.correo = localStorage.getItem('correoRecuperacion') || '';
  }
  

  actualizarContrasena() {
    if (!this.codigo || !this.contrasena1 || !this.contrasena2) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }
    if (this.contrasena1 !== this.contrasena2) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    this.http.put('http://18.191.67.127:3000/api/usuarios/actualizar-contrasena', {
      correo: this.correo,
      codigo: this.codigo,
      nuevaContrasena: this.contrasena1
    }).subscribe({
      next: (res: any) => {
        this.mensaje = 'Contraseña actualizada correctamente';
        this.codigo = '';
        this.contrasena1 = '';
        this.contrasena2 = '';
        localStorage.removeItem('correoRecuperacion');
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al actualizar la contraseña';
      }
    });
  }
}