import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  imagenSeleccionada: File | null = null;
  modalExito: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<any>('http://18.191.67.127:3000/api/usuarios/ver-info', { headers })
        .subscribe({
          next: (info) => {
            this.nombre = info.nombre || '';
            this.apellido = info.apellido || '';
            this.correo = info.correo || '';
            this.foto = info.imagen ? `http://18.191.67.127:3000/${info.imagen}` : 'assets/img/brian.png';
          },
          error: () => {
            this.mensaje = 'No se pudo cargar la información del usuario.';
          }
        });
    }
  }

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
    if (this.password) body.contrasena = this.password; // el backend espera 'contrasena'

    if (Object.keys(body).length === 0 && !this.imagenSeleccionada) {
      this.mensaje = 'Debes ingresar al menos un dato para actualizar';
      return;
    }

    // Obtener el token correctamente
    const token = localStorage.getItem('token');
    if (!token) {
      this.mensaje = 'No hay sesión activa.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    if (this.imagenSeleccionada) {
      const formData: FormData = new FormData();
      Object.keys(body).forEach(key => formData.append(key, body[key]));
      formData.append('imagen', this.imagenSeleccionada);

      // Depuración: mostrar los pares clave-valor de FormData
      for (const pair of (formData as any).entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }

      this.http.put('http://18.191.67.127:3000/api/usuarios/actualizar', formData, { headers })
        .subscribe({
          next: () => {
            this.mensaje = 'Datos actualizados correctamente';
            this.recargarImagen();
            this.modalExito = true;
          },
          error: (err) => {
            this.mensaje = err.error?.mensaje || 'Error al actualizar los datos';
          }
        });
    } else {
      this.http.put('http://18.191.67.127:3000/api/usuarios/actualizar', body, { headers })
        .subscribe({
          next: () => {
            this.mensaje = 'Datos actualizados correctamente';
            this.modalExito = true;
          },
          error: (err) => {
            this.mensaje = err.error?.mensaje || 'Error al actualizar los datos';
          }
        });
    }
  }

  // Método para recargar la imagen después de actualizar
  private recargarImagen() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<any>('http://18.191.67.127:3000/api/usuarios/ver-info', { headers })
        .subscribe({
          next: (info) => {
            this.foto = info.imagen ? `http://18.191.67.127:3000/${info.imagen}` : 'assets/img/brian.png';
          }
        });
    }
  }

  irAHome() {
    this.router.navigate(['/home']);
  }

  cerrarModalExito() {
    this.modalExito = false;
    this.router.navigate(['/home']);
  }
}