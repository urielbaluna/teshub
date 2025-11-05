import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-correorecuperacion',
  templateUrl: './correorecuperacion.component.html',
  styleUrls: ['./correorecuperacion.component.css']
})
export class CorreorecuperacionComponent {
  correo: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient) {}
enviarCorreo() {
  if (!this.correo) {
    this.mensaje = 'Por favor ingresa un correo válido';
    return;
  }
   localStorage.setItem('correoRecuperacion', this.correo);


  this.http.post(`${environment.apiBaseUrl}/api/usuarios/codigo-contrasena`, {
    correo: this.correo
  })
    .subscribe({
      next: (res: any) => {
        this.mensaje = 'Correo de recuperación enviado';
        this.correo = '';
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al enviar el correo de recuperación';
      }
    });
}
}