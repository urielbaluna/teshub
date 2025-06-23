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

  comentarioInicio: number[] = [];

  constructor(
    private router: Router,
    private publicacionesService: PublicacionesService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.publicacionesService.obtenerPublicacionesApi().subscribe((data: any[]) => {
      this.publicaciones = data;
      this.comentarioInicio = this.publicaciones.map(() => 0); // Inicializa el índice para cada publicación
      this.actualizarNumeroPublicaciones();
    });
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado && usuarioGuardado !== 'undefined') {
      this.usuario = JSON.parse(usuarioGuardado);
    }
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
    // Aquí deberías llamar a un método de tu servicio que elimine por ID en la API si lo tienes
    // Por ahora solo recarga las publicaciones
    this.publicacionesService.obtenerPublicacionesApi().subscribe((data: any[]) => {
      this.publicaciones = data;
      this.actualizarNumeroPublicaciones();
    });
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
  getPrimerColaborador(colaboradores: string[]): string {
    return colaboradores && colaboradores.length > 0 ? colaboradores[0] : '';
  }

  getColaboradoresRestantes(colaboradores: string[]): string[] {
    return colaboradores && colaboradores.length > 1 ? colaboradores.slice(1) : [];
  }

  getColaboradoresTooltip(colaboradores: string[]): string {
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

    const publicacion = this.publicaciones[index];
    const id_publi = publicacion.id_publi;
    const matricula = this.usuario.matricula;

    this.publicacionesService.comentarPublicacion(id_publi, texto, matricula).subscribe({
      next: (resp) => {
        // Opcional: recargar comentarios o agregar el nuevo comentario localmente
        if (!publicacion.comentarios) publicacion.comentarios = [];
        publicacion.comentarios.push({
          nombre: this.usuario.nombre,
          comentario: texto,
          matricula: matricula
        });
        this.nuevoComentario[index] = '';
      },
      error: (err) => {
        // Manejo de error
        console.error('Error al comentar:', err);
      }
    });
  }

  verMasComentarios(i: number, total: number) {
    if (this.comentarioInicio[i] + 3 < total) {
      this.comentarioInicio[i]++;
    }
  }

  verMenosComentarios(i: number) {
    if (this.comentarioInicio[i] > 0) {
      this.comentarioInicio[i]--;
    }
  }

  eliminarComentario(pubIndex: number, comIndex: number) {
    const publicacion = this.publicaciones[pubIndex];
    const comentarioObj = publicacion.comentarios[comIndex];
    const id_publi = publicacion.id_publi;
    const comentario = comentarioObj.comentario;
    const matricula = comentarioObj.matricula?.toString() || this.usuario.matricula;

    this.publicacionesService.eliminarComentarioPublicacion(id_publi, comentario, matricula).subscribe({
      next: () => {
        publicacion.comentarios.splice(comIndex, 1);
      },
      error: (err) => {
        console.error('Error al eliminar comentario:', err);
      }
    });
  }

  esImagen(archivo: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(archivo);
  }

  getUrlArchivo(archivo: string): string {
    return `http://18.191.67.127:3000/${archivo}`;
  }

  getNombreArchivo(archivo: string): string {
    return archivo.split('/').pop() || archivo;
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

  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  irAlPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}