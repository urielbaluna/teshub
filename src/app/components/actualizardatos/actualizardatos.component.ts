import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actualizardatos',
  templateUrl: './actualizardatos.component.html',
  styleUrls: ['./actualizardatos.component.css']
})
export class ActualizardatosComponent implements OnInit {
  
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  password: string = '';
  mensaje: string = '';
  foto: string = 'assets/img/brian.png';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado && usuarioGuardado !== 'undefined') {
      const usuario = JSON.parse(usuarioGuardado);
      this.nombre = usuario.nombre || '';
      this.apellido = usuario.apellidos || usuario.apellido || '';
      this.correo = usuario.correo || '';
      this.foto = usuario.foto || 'assets/img/brian.png'; 
      
    }
  }
  imagenSeleccionada: File | null = null;

onImagenSeleccionada(event: any) {
  const archivo = event.target.files[0];
  if (archivo) {
    this.imagenSeleccionada = archivo;

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.foto = e.target.result;
    };
    reader.readAsDataURL(archivo);
  }
}

  actualizarDatos() {
    const body: any = {};
    if (this.nombre) body.nombre = this.nombre;
    if (this.apellido) body.apellido = this.apellido;
    if (this.correo) body.correo = this.correo;
    if (this.password) body.password = this.password;

    if (Object.keys(body).length === 0 && !this.imagenSeleccionada) {
      this.mensaje = 'Debes ingresar al menos un dato para actualizar';
      return;
    }

    // Obtener el token del usuario
    const usuarioGuardado = localStorage.getItem('usuario');
    let token = '';
    if (usuarioGuardado && usuarioGuardado !== 'undefined') {
      const usuario = JSON.parse(usuarioGuardado);
      token = usuario.token;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Si hay imagen seleccionada, usa FormData
    if (this.imagenSeleccionada) {
      const formData = new FormData();
      Object.keys(body).forEach(key => formData.append(key, body[key]));
      formData.append('imagen', this.imagenSeleccionada);
      this.http.put('http://18.191.67.127:3000/api/usuarios/actualizar', formData, { headers })
        .subscribe({
          next: (res: any) => {
            this.mensaje = 'Datos actualizados correctamente';
          },
          error: (err) => {
            this.mensaje = err.error?.mensaje || 'Error al actualizar los datos';
          }
        });
    } else {
      this.http.put('http://18.191.67.127:3000/api/usuarios/actualizar', body, { headers })
        .subscribe({
          next: (res: any) => {
            this.mensaje = 'Datos actualizados correctamente';
          },
          error: (err) => {
            this.mensaje = err.error?.mensaje || 'Error al actualizar los datos';
          }
        });
    }
  }
}