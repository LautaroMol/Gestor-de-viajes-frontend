import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Carga } from '../../Interfaces/carga';
import { CargaService } from '../../Services/carga.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carga-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule,ReactiveFormsModule],
  templateUrl: './carga-form.component.html',
  styleUrls: ['./carga-form.component.css']
})
export class CargaFormComponent implements OnInit {
  formCarga: FormGroup;
  tituloAccion: string = "Nueva";
  botonAccion: string = "Guardar";
  dataCarga: Carga | null = null;

  constructor(
    private dialogoReferencia: MatDialogRef<CargaFormComponent>,
    private fb: FormBuilder,
    private _cargaServicio: CargaService,
    @Inject(MAT_DIALOG_DATA) public data: Carga | null
  ) {
    this.formCarga = this.fb.group({
      codigo: ['', Validators.required],
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
      unidadDeMedida: ['', Validators.required],
      precioUnit: ['', Validators.required],
      bonif: ['', Validators.required],
      subtotal: ['', Validators.required],
      iva: ['', Validators.required],
      idViaje: ['', Validators.required],
      borrado: [false]
    });

    if (data) {
      this.dataCarga = data;
      this.formCarga.patchValue(data);
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.formCarga.valid) {
      const carga: Carga = {
        idcarga: this.dataCarga ? this.dataCarga.idcarga : 0,
        idViaje: 1,
        ...this.formCarga.value
      };

      if (this.dataCarga == null) {
        this._cargaServicio.add(carga).subscribe({
          next: () => {
            console.log("Carga cargada al sistema exitosamente");
            this.dialogoReferencia.close("Creada");
          },
          error: () => {
            console.error("No se ha podido crear la carga");
          }
        });
      } else {
        this._cargaServicio.update(carga,carga.idcarga).subscribe({
          next: () => {
            console.log("Carga editada correctamente");
            this.dialogoReferencia.close("Editada");
          },
          error: () => {
            console.error("No se ha podido editar la carga");
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogoReferencia.close();
  }
}
