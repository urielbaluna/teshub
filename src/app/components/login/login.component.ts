import { Component } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/enviroments/enviroment';

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

    this.http.post(`${environment.apiBaseUrl}/api/usuarios/login`, datos)
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
        foto: 'assets/img/brian.png',
        token: respuesta.token
        
      };
      

      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('token', respuesta.token);
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
