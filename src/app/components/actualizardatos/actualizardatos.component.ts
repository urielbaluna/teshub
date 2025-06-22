import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actualizardatos',
  templateUrl: './actualizardatos.component.html',
  styleUrls: ['./actualizardatos.component.css']
})
export class ActualizardatosComponent implements OnInit {
  codigo: string = '';
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado && usuarioGuardado !== 'undefined') {
      const usuario = JSON.parse(usuarioGuardado);
      this.nombre = usuario.nombre || '';
      this.apellido = usuario.apellidos || usuario.apellido || '';
      this.correo = usuario.correo || '';
    }
  }

  actualizarDatos() {
    if (!this.codigo || !this.nombre || !this.apellido || !this.correo || !this.password) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    const body = {
      codigo: this.codigo,
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      password: this.password
    };

    this.http.put('http://18.191.67.127:3000/api/usuarios/actualizar', body)
      .subscribe({
        next: (res: any) => {
          this.mensaje = 'Datos actualizados correctamente';
        },
        error: (err) => {
          this.mensaje = err.error?.mensaje || 'Error al actualizar los datos';
        }
      });
  }
  enviarCodigo() {
  if (!this.correo) {
    this.mensaje = 'Por favor ingresa tu correo electrónico';
    return;
  }
  const usuarioGuardado = localStorage.getItem('usuario');
  let token = '';
  if (usuarioGuardado && usuarioGuardado !== 'undefined') {
    const usuario = JSON.parse(usuarioGuardado);
    token = usuario.token;
  }

  const headers = new HttpHeaders({
    autenticar: `Bearer${token}`
  });

  this.http.post(
    'http://18.191.67.127:3000/api/usuarios/solicitar-codigo',
    { correo: this.correo },
    { headers }
  ).subscribe({
    next: (res: any) => {
      this.mensaje = res.mensaje || 'Código enviado al correo';
    },
    error: (err) => {
      this.mensaje = err.error?.mensaje || JSON.stringify(err.error) || 'Error al enviar el código';
    }
  });
}
}