import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { HttpClient} from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  onSubmit() {
    const datos = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      matricula: this.matricula,
      contrasena: this.contrasena,
    };

    this.http.post('http://18.191.67.127:3000/api/usuarios/registrar', datos)
      .subscribe({
        next: (respuesta: any) => {
          this.mensaje = 'Cuenta creada exitosamente';
          
          console.log(respuesta);
        },
        error: (error) => {
          this.mensaje = 'Error al crear la cuenta';
          console.error(error);
        }
      });
  }
}
