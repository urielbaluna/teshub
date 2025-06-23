import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {
    nombre: '',
    apellidos: '',
    matricula: '',
    correo: '',
    publicaciones: 0,
    rol: '',
    foto: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado && usuarioGuardado !== 'undefined') {
      this.usuario = JSON.parse(usuarioGuardado);
    }
  }

  cerrarVerPerfil() {
    this.router.navigate(['/home']);
  }
}