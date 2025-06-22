import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private publicaciones: any[] = [];

  constructor() {
    // Cargar publicaciones desde localStorage al iniciar
    const guardadas = localStorage.getItem('publicaciones');
    this.publicaciones = guardadas ? JSON.parse(guardadas) : [];
  }

  private guardarEnLocalStorage() {
    localStorage.setItem('publicaciones', JSON.stringify(this.publicaciones));
  }

  // Método público para actualizar el localStorage desde fuera del servicio
  public actualizarLocalStorage() {
    this.guardarEnLocalStorage();
  }

  agregarPublicacion(publicacion: any) {
    this.publicaciones.unshift(publicacion);
    this.guardarEnLocalStorage();
  }

  obtenerPublicaciones(): any[] {
    return this.publicaciones;
  }

  eliminarPublicacion(index: number) {
    this.publicaciones.splice(index, 1);
    this.guardarEnLocalStorage();
  }
}