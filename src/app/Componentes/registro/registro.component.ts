import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccesoService } from '../../Services/acceso.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { User } from '../../Interfaces/user';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', Validators.required]
  });

  public errorMessage: string = ''; // Propiedad para almacenar el mensaje de error

  registrarse() {
    if (this.formRegistro.invalid) return;

    const obj: User = {
      nombre: this.formRegistro.value.nombre,
      correo: this.formRegistro.value.correo,
      pass: this.formRegistro.value.clave
    };

    this.accesoService.register(obj).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          this.router.navigate(['/viajes']);
        } else {
          this.errorMessage = "No se pudo registrar. Intente nuevamente.";
        }
      },
      error: (error) => {
        if (error.status === 409) { // 409 Conflict: Correo ya registrado
          this.errorMessage = error.error.message; // Asigna el mensaje de error del backend
        } else {
          this.errorMessage = "Ocurrió un error inesperado. Intente nuevamente.";
        }
      }
    });
  }

  volver() {
    this.router.navigate(['']);
  }
}
