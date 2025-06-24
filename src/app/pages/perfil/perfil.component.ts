import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilService } from 'src/app/services/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {
    matricula: '',
    imagen: '',
    nombre: '',
    apellido: '',
    rol: '',
    total_publicaciones: 0,
    publicaciones: []
  };

  constructor(
    private router: Router,
    private perfilService: PerfilService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const matricula = this.route.snapshot.paramMap.get('matricula');
    this.perfilService.obtenerPerfil(matricula || undefined).subscribe({
      next: (resp) => {
        this.usuario = {
          matricula: resp.matricula,
          imagen: resp.imagen ? `http://18.191.67.127:3000/${resp.imagen}` : 'assets/default-user.png',
          nombre: resp.nombre,
          apellido: resp.apellido,
          rol: resp.rol,
          total_publicaciones: resp.total_publicaciones,
          publicaciones: resp.publicaciones || []
        };
      }
    });
  }

  cerrarVerPerfil() {
    this.router.navigate(['/home']);
  }
}