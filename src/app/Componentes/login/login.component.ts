import { Component, inject } from '@angular/core';
import { AccesoService } from '../../Services/acceso.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../Interfaces/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    correo:['',Validators.required],
    clave: ['',Validators.required]
  })

  iniciarSesion(){
    if(this.formLogin.invalid) return;

    const obj:Login = {
      correo: this.formLogin.value.correo,
      pass: this.formLogin.value.clave
    }

    this.accesoService.login(obj).subscribe({
      next:(data) =>{
        if(data.isSuccess){
          localStorage.setItem("token",data.token);
          this.router.navigate(['viajes']);
        }else{
          alert("Credenciales son incorrectas")
        }
      },
      error:(e) =>{
        alert("Error al iniciar sesion: " + e.message)
      }

    })

  }

  registrarse(){
    this.router.navigate(['registro']);
  }


}
