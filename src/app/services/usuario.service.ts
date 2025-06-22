import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  getUsuario() {
    return {
      nombre: 'Uriel',
      apellidos: 'Barrera Luna',
      matricula: '202124003',
      correo: 'uriel_bl1@tesch.edu.mx',
      publicaciones: 15,
      destacada: 'TESHUB',
      rol: 'Estudiante',
      foto: 'assets/img/brian.png'
    };
  }
}