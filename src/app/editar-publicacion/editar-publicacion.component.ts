import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PublicacionesService } from 'src/app/services/publicaciones.service';

@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.component.html',
  styleUrls: ['./editar-publicacion.component.css']
})
export class EditarPublicacionComponent implements OnInit {
  titulo: string = '';
  colaboradores: string = '';
  descripcion: string = '';
  archivosSeleccionados: File[] = [];

  idPublicacion!: string;

  // Modal archivo preview
  modalVisible: boolean = false;
  archivoPreviewUrl: SafeResourceUrl | null = null;
  archivoPreviewNombre: string = '';
  archivoPreviewTipo: string = '';

  // Modal éxito
  modalExito: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private publicacionesService: PublicacionesService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idPublicacion = this.route.snapshot.paramMap.get('id')!;
    this.cargarDatos();
  }

  cargarDatos() {
    this.publicacionesService.obtenerPublicacionPorId(this.idPublicacion).subscribe((pub) => {
      this.titulo = pub.titulo;
      this.colaboradores = pub.colaboradores;
      this.descripcion = pub.descripcion;
      // Si quieres cargar archivos ya existentes, se necesita otro arreglo para mostrarlos
    });
  }

  onFilesSelected(event: any): void {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      this.archivosSeleccionados.push(selectedFiles[i]);
    }
  }

  eliminarArchivo(index: number): void {
    this.archivosSeleccionados.splice(index, 1);
  }

  verArchivo(archivo: File): void {
    this.archivoPreviewNombre = archivo.name;
    this.archivoPreviewTipo = archivo.type;

    const reader = new FileReader();
    reader.onload = () => {
      this.archivoPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
      this.modalVisible = true;
    };
    reader.readAsDataURL(archivo);
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.archivoPreviewUrl = null;
    this.archivoPreviewNombre = '';
    this.archivoPreviewTipo = '';
  }

  cerrarModalExito(): void {
    this.modalExito = false;
    this.router.navigate(['/home']);
  }

  actualizarPublicacion(): void {
    const formData = new FormData();
    formData.append('titulo', this.titulo);
    formData.append('colaboradores', this.colaboradores);
    formData.append('descripcion', this.descripcion);
    this.archivosSeleccionados.forEach((archivo) => {
      formData.append('archivos', archivo);
    });

    this.publicacionesService.actualizarPublicacion(this.idPublicacion, formData).subscribe(
      () => {
        this.modalExito = true;
      },
      (error) => {
        console.error('Error al actualizar publicación', error);
      }
    );
  }
}