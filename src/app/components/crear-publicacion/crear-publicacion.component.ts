import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent {
  archivosSeleccionados: File[] = [];
  titulo: string = '';
  colaboradores: string = '';
  descripcion: string = '';
  modalVisible: boolean = false;
  archivoPreviewUrl: string | null = null;
  archivoPreviewTipo: string | null = null;
  archivoPreviewNombre: string | null = null;
  modalExito: boolean = false;

  constructor(
    private publicacionesService: PublicacionesService,
    private router: Router
  ) {}

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    const nuevosArchivos = Array.from(files);

    nuevosArchivos.forEach(nuevo => {
      if (!this.archivosSeleccionados.some(a => a.name === nuevo.name && a.size === nuevo.size)) {
        this.archivosSeleccionados.push(nuevo);
      }
    });
  }

  eliminarArchivo(indice: number) {
    this.archivosSeleccionados.splice(indice, 1);
  }

  verArchivo(archivo: File) {
    this.archivoPreviewNombre = archivo.name;
    this.archivoPreviewTipo = archivo.type;

    if (archivo.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.archivoPreviewUrl = e.target.result;
        this.modalVisible = true;
      };
      reader.readAsDataURL(archivo);
    } else {
      const url = URL.createObjectURL(archivo);
      const a = document.createElement('a');
      a.href = url;
      a.download = archivo.name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  }

  cerrarModal() {
    this.modalVisible = false;
    this.archivoPreviewUrl = null;
    this.archivoPreviewTipo = null;
    this.archivoPreviewNombre = null;
  }

  cerrarCrearPublicacion() {
    this.router.navigate(['/home']);
  }

  // Convierte un archivo a un objeto { name, type, dataUrl }
  archivoADataUrl(archivo: File): Promise<any> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve({
          name: archivo.name,
          type: archivo.type,
          dataUrl: e.target.result
        });
      };
      reader.readAsDataURL(archivo);
    });
  }

  // Cambia este método para guardar archivos como base64/dataUrl
async publicar() {
  if (!this.colaboradores || this.colaboradores.trim() === '') {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.colaboradores = `${usuario.nombre} ${usuario.apellidos}`;
  }

  const formData = new FormData();
  formData.append('titulo', this.titulo);
  formData.append('colaboradores', this.colaboradores);
  formData.append('descripcion', this.descripcion);

  this.archivosSeleccionados.forEach((archivo, i) => {
    formData.append('archivos', archivo, archivo.name);
  });

  this.publicacionesService.agregarPublicacion(formData).subscribe({
    next: () => {
      this.modalExito = true;
    },
    error: (err) => {
      console.error('Error al crear publicación:', err);
    }
  });
}

  cerrarModalExito() {
    this.modalExito = false;
    this.router.navigate(['/home']);
  }
}