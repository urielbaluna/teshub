import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  mensaje: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const datos = {
      correo: this.correo,
      contrasena: this.contrasena
    };

    this.http.post('http://18.191.67.127:3000/api/usuarios/login', datos)
  .subscribe({
    next: (respuesta: any) => {
      this.mensaje = 'Login exitoso';

      // Normaliza los datos para el home
      const usuario = {
        nombre: respuesta.nombre,
        apellidos: respuesta.apellido, // O usa `${respuesta.apellido}` si solo hay uno
        matricula: respuesta.matricula,
        correo: respuesta.correo,
        publicaciones: 0, // Puedes calcularlo después
        destacada: respuesta.destacada || '', // Si existe
        rol: respuesta.rol || 'Estudiante',   // Si existe
        foto: 'assets/img/brian.png' // O la ruta que corresponda
      };

      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.router.navigate(['/home']); 
      console.log(respuesta);
    },
    error: (error) => {
      this.mensaje = 'Credenciales incorrectas';
      console.error(error);
    }
  });
  }
 

}
