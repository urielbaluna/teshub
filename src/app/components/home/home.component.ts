import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  publicaciones: any[] = [];
  usuario: any = { 
    nombre: '',
    apellidos: '',
    matricula: '',
    correo: '',
    publicaciones: 0,
    destacada: '',
    rol: '',
    foto: ''
  };
  mostrarMenuPerfil: boolean = false;
  mostrarModalPerfil: boolean = false;

  // Variables para el modal de imagen
  imagenModalVisible: boolean = false;
  imagenModalUrl: string | null = null;
  imagenModalNombre: string | null = null;

  // Para tooltip de colaboradores
  mostrarTooltip: number | null = null;

  // Para modal de éxito al publicar (si lo necesitas aquí)
  modalExito: boolean = false;

  // Para comentarios
  nuevoComentario: string[] = [];

  constructor(
    private router: Router,
    private publicacionesService: PublicacionesService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
  this.publicaciones = this.publicacionesService.obtenerPublicaciones();
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado && usuarioGuardado !== 'undefined') {
    this.usuario = JSON.parse(usuarioGuardado);
  }
  this.actualizarNumeroPublicaciones();
}

  irACrearPublicacion() {
    this.router.navigate(['/crear-publicacion']);
  }

  abrirModalPerfil() {
    this.mostrarModalPerfil = true;
  }

  cerrarModalPerfil() {
    this.mostrarModalPerfil = false;
  }

  eliminarPublicacion(index: number) {
    this.publicacionesService.eliminarPublicacion(index);
    // Clona el array para forzar el refresco de Angular
    this.publicaciones = [...this.publicacionesService.obtenerPublicaciones()];
    this.actualizarNumeroPublicaciones();
  }

  descargarArchivo(archivo: any) {
    const a = document.createElement('a');
    a.href = archivo.dataUrl;
    a.download = archivo.name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  }

  // Modal para visualizar imagen grande
  abrirImagenModal(archivo: any) {
    this.imagenModalNombre = archivo.name;
    this.imagenModalUrl = archivo.dataUrl;
    this.imagenModalVisible = true;
  }

  cerrarImagenModal() {
    this.imagenModalVisible = false;
    this.imagenModalUrl = null;
    this.imagenModalNombre = null;
  }

  // Colaboradores: solo principal, tooltip con los demás
  getPrimerColaborador(colaboradores: string): string {
    if (!colaboradores) return '';
    return colaboradores.split(',')[0].trim();
  }

  getColaboradoresRestantes(colaboradores: string): string[] {
    if (!colaboradores) return [];
    const arr = colaboradores.split(',').map(c => c.trim());
    return arr.length > 1 ? arr.slice(1) : [];
  }

  getColaboradoresTooltip(colaboradores: string): string {
    const restantes = this.getColaboradoresRestantes(colaboradores);
    return restantes.length ? restantes.join('\n') : '';
  }

  // Modal de éxito al publicar (si lo necesitas aquí)
  cerrarModalExito() {
    this.modalExito = false;
  }

  // Comentarios
  publicarComentario(index: number) {
    const texto = (this.nuevoComentario[index] || '').trim();
    if (!texto) return;
    const comentario = {
      autor: this.usuario.nombre,
      texto
    };
    this.publicaciones[index].comentarios = this.publicaciones[index].comentarios || [];
    this.publicaciones[index].comentarios.push(comentario);
    this.nuevoComentario[index] = '';
    // Guarda en localStorage (usa método público, ver nota abajo)
    this.publicacionesService.actualizarLocalStorage();
  }

  eliminarComentario(pubIndex: number, comIndex: number) {
    this.publicaciones[pubIndex].comentarios.splice(comIndex, 1);
    this.publicacionesService.actualizarLocalStorage();
  }

  // Actualiza el número de publicaciones en las que participa el usuario
  actualizarNumeroPublicaciones() {
    if (!this.usuario || !this.usuario.nombre) {
      this.usuario.publicaciones = 0;
      return;
    }
    this.usuario.publicaciones = this.publicaciones.filter(pub =>
      pub.colaboradores?.toLowerCase().includes(this.usuario.nombre.toLowerCase())
    ).length;
  }
}