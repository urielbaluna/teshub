import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerInfoUsuario() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/api/usuarios/ver-info`,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarCuenta(matricula: string) {
    const body = { matricula };
    return this.http.post(
      `${environment.apiBaseUrl}/api/usuarios/eliminar/`,
      body,
      { headers: this.getAuthHeaders() }
    );
  }
}