import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://18.191.67.127:3000/api/usuarios/ver-info-publicaciones';

  constructor(private http: HttpClient) {}

    obtenerPerfil(matricula?: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
    });
    const body = { matricula }
    return this.http.post<any>(this.apiUrl, body, { headers });
    }
}