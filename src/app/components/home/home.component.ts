import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import { UsuariosService } from '../../services/usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  // Para mostrar la info actualizada en el modal
  usuarioInfoModal: any = {};

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
    private usuarioService: UsuariosService,
    private http: HttpClient
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
    // Si hay token, pide la info real (incluida la foto)
    if (this.usuario.token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.usuario.token}`
      });
      this.http.get('http://18.191.67.127:3000/api/usuarios/ver-info', { headers })
        .subscribe((info: any) => {
          // Actualiza la foto si viene en la respuesta
          if (info.imagen && info.imagen.trim() !== '') {
            this.usuario.foto = `http://18.191.67.127:3000${info.imagen.startsWith('/') ? '' : '/'}${info.imagen}`;
            // Actualiza en localStorage para otros componentes
            localStorage.setItem('usuario', JSON.stringify(this.usuario));
          }
        });
    }
    this.actualizarNumeroPublicaciones();
  }

  irACrearPublicacion() {
    this.router.navigate(['/crear-publicacion']);
  }

  abrirModalPerfil() {
    // Obtiene la info actualizada del usuario para el modal
    const token = this.usuario.token;
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      this.http.get('http://18.191.67.127:3000/api/usuarios/ver-info', { headers })
        .subscribe((info: any) => {
          this.usuarioInfoModal = {
            ...info,
            imagen: info.imagen
              ? `http://18.191.67.127:3000${info.imagen.startsWith('/') ? '' : '/'}${info.imagen}`
              : 'assets/img/brian.png'
          };
          this.mostrarModalPerfil = true;
        }, () => {
          // Si falla, muestra el modal con los datos locales
          this.usuarioInfoModal = { ...this.usuario };
          this.mostrarModalPerfil = true;
        });
    } else {
      this.usuarioInfoModal = { ...this.usuario };
      this.mostrarModalPerfil = true;
    }
  }

  cerrarModalPerfil() {
    this.mostrarModalPerfil = false;
  }

  eliminarPublicacion(index: number) {
    const publicacion = this.publicaciones[index];
    const id_publi = publicacion.id_publi;
    this.publicacionesService.eliminarPublicacion(id_publi).subscribe({
      next: () => {
        this.publicaciones.splice(index, 1); // Elimina de la vista
      },
      error: (err) => {
        console.error('Error al eliminar publicación:', err);
      }
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
        if (!publicacion.comentarios) publicacion.comentarios = [];
        publicacion.comentarios.push({
          nombre: this.usuario.nombre,
          comentario: texto,
          matricula: matricula
        });
        this.nuevoComentario[index] = '';
      },
      error: (err) => {
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

  esIntegrante(pub: any): boolean {
    if (!pub.integrantes || !this.usuario?.matricula) return false;
    return pub.integrantes.some((int: any) => int.matricula == this.usuario.matricula);
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

    eliminarCuenta() {
    const matricula = this.usuarioInfoModal.matricula || this.usuario.matricula;
    this.usuarioService.eliminarCuenta(matricula).subscribe({
      next: () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al eliminar cuenta:', err);
        alert('No se pudo eliminar la cuenta.');
      }
    });
  }

  palabraBusqueda: string = '';

  perfiles: any[] = [];

  buscar() {
    const palabra = this.palabraBusqueda.trim();
    if (palabra.length === 0) {
      this.cargarPublicaciones();
      this.perfiles = [];
      return;
    }
    this.http.get<any>(`http://18.191.67.127:3000/api/buscar?palabra=${encodeURIComponent(palabra)}`)
      .subscribe({
        next: (resp) => {
          this.publicaciones = resp.publicaciones || [];
          this.perfiles = resp.perfiles || [];
        },
        error: (err) => {
          console.error('Error en búsqueda:', err);
          this.publicaciones = [];
          this.perfiles = [];
        }
      });
  }
    // Método para cargar todas las publicaciones (llámalo en ngOnInit y cuando el input esté vacío)
    cargarPublicaciones() {
      this.publicacionesService.obtenerPublicacionesApi().subscribe((data: any[]) => {
        this.publicaciones = data;
      });
    }
}
