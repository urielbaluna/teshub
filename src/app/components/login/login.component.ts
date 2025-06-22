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
          // Aquí puedes guardar el token o redirigir
          this.router.navigate(['/home']); //redige a la pagina de inicio
          console.log(respuesta);
        },
        error: (error) => {
          this.mensaje = 'Credenciales incorrectas';
          console.error(error);
        }
      });
  }
 


}
