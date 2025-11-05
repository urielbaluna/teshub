import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../enviroments//enviroment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private apiUrlListar = `${environment.apiBaseUrl}/api/publicaciones/listar`;
  private apiUrlCrear = `${environment.apiBaseUrl}/api/publicaciones/crear`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerPublicacionesApi(): Observable<any[]> {
    return this.http.get<{ publicaciones: any[] }>(
      this.apiUrlListar,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(res => res.publicaciones)
    );
  }

  agregarPublicacion(publicacion: any): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/api/publicaciones/crear`,
      publicacion,
      { headers: this.getAuthHeaders() }
    );
  }
  eliminarPublicacion(id_publi: number) {
    return this.http.delete(
      `${environment.apiBaseUrl}/api/publicaciones/eliminar/${id_publi}`,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarComentarioPublicacion(id_publi: number, comentario: string, matricula: string) {
    const body = { id_publi, comentario, matricula };
    return this.http.post(
      `${environment.apiBaseUrl}/api/publicaciones/eliminar-comentario`,
      body,
      { headers: this.getAuthHeaders() }
    );
  }

  comentarPublicacion(id_publi: number, comentario: string, matricula: string): Observable<any> {
    const body = {
      id_publi,
      comentario,
      matricula
    };
    return this.http.post(
      `${environment.apiBaseUrl}/api/publicaciones/comentar`,
      body,
      { headers: this.getAuthHeaders() }
    );
  }

  obtenerPublicacionPorId(id: string): Observable<any> {
    return this.http.get(
      `${environment.apiBaseUrl}/api/publicaciones/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  actualizarPublicacion(id: string, publicacion: FormData): Observable<any> {
    return this.http.put(
      `${environment.apiBaseUrl}/api/publicaciones/${id}`,
      publicacion,
      { headers: this.getAuthHeaders() }
    );
  }
}