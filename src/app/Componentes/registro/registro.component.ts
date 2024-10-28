import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccesoService } from '../../Services/acceso.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Login } from '../../Interfaces/login';
import { Router } from '@angular/router';
import { User } from '../../Interfaces/user';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private accesoService = inject(AccesoService);

  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    nombre: ['',Validators.required],
    correo:['',Validators.required],
    clave: ['',Validators.required]
  })

  registrarse(){
    if(this.formRegistro.invalid) return;

    const obj: User = {
      nombre: this.formRegistro.value.nombre,
      correo: this.formRegistro.value.correo,
      pass: this.formRegistro.value.clave
    }
    this.accesoService.register(obj).subscribe ({
      next:(data)=> {
        if(data.isSuccess){
          this.router.navigate(['/viajes']);
        }else{
          alert("no se pudo registrar")
        }
      }, error:(error)=>{
        console.log(error.message);
      }
    })
  }

  volver(){
    this.router.navigate(['']);
  }

}
