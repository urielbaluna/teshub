import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-register',
  templateUrl: './crearcuenta.component.html',
  styleUrls: ['./crearcuenta.component.css']
})
export class CrearcuentaComponent {
  nombre = '';
  apellido = '';
  correo = '';
  matricula = '';
  contrasena = '';
  mensaje = '';

  constructor(private http: HttpClient, private router: Router) {} // <--- agrega aquí el Router

  onSubmit() {
    const datos = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      matricula: this.matricula,
      contrasena: this.contrasena,
    };

    this.http.post(`${environment.apiBaseUrl}/api/usuarios/registrar`, datos)
      .subscribe({
        next: (respuesta: any) => {
          this.mensaje = 'Cuenta creada exitosamente';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
          console.log(respuesta);
        },
        error: (error) => {
          this.mensaje = 'Error al crear la cuenta';
          console.error(error);
        }
      });
  }
}