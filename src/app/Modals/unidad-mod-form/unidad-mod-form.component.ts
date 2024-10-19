import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Unidad } from '../../Interfaces/unidad';
import { UnidadService } from '../../Services/unidad.service';
import { AmortizacionService } from '../../Services/amortizacion.service';
import { Amortizacion } from '../../Interfaces/amortizacion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-unidad-mod-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule, MatSnackBarModule],
  templateUrl: './unidad-mod-form.component.html',
  styleUrl: './unidad-mod-form.component.css'
})
export class UnidadModFormComponent implements OnInit {
  formUnidad: FormGroup;
  tituloAccion: string = "Guardar";
  botonAccion: string = "Guardar";
  dataUnidad: Unidad | null = null;

  constructor(
    private dialogoReferencia: MatDialogRef<UnidadModFormComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private unidadService: UnidadService,
    private amortizacionService: AmortizacionService,
    @Inject(MAT_DIALOG_DATA) public data: { unidad: Unidad, amort: Amortizacion }
  ) {
    this.formUnidad = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      ruedas: ['', Validators.required],
      valoracion: [0, [Validators.required, Validators.min(1)]],
    });
    if (data) {
      this.dataUnidad = data.unidad;
    }
  }

  ngOnInit() {
    if (this.dataUnidad) {
      this.patchFormValues(this.dataUnidad);
    }
  }
  
  onSubmit() {
    if (this.formUnidad.valid) {
        const numeroRuedas = this.formUnidad.get('ruedas')?.value;
        const ruedasArray = Array.from({ length: numeroRuedas }, (_, index) => index + 1);
        
        let estadoRuedaArray: number[];
        if (this.dataUnidad) {
            estadoRuedaArray = this.dataUnidad.estadoRueda.slice();
            if (numeroRuedas > estadoRuedaArray.length) {
                estadoRuedaArray = [...estadoRuedaArray, ...Array(numeroRuedas - estadoRuedaArray.length).fill(0)];
            } else if (numeroRuedas < estadoRuedaArray.length) {
                estadoRuedaArray = estadoRuedaArray.slice(0, numeroRuedas);
            }
        } else {
            estadoRuedaArray = Array(numeroRuedas).fill(0);
        }

        const nuevaUnidad: Unidad = {
            idUnidad: this.dataUnidad ? this.dataUnidad.idUnidad : 0,
            ...this.formUnidad.value,
            ruedas: ruedasArray,
            estadoRueda: estadoRuedaArray,
        };

        // Si la unidad es nueva
        if (!this.dataUnidad) {
            this.unidadService.add(nuevaUnidad).subscribe({
                next: (data) => {
                    this.mostrarAlerta("Unidad creada correctamente", "X");
                }, error: (e) => {
                    this.mostrarAlerta("No se pudo crear la unidad", "X");
                }
            });
        } else {
            this.unidadService.update(nuevaUnidad).subscribe({
                next: () => {
                    this.mostrarAlerta("Unidad actualizada correctamente", "X");
                    this.dialogoReferencia.close(nuevaUnidad);
                },
                error: () => {
                    this.mostrarAlerta("No se pudo actualizar la unidad", "X");
                }
            });
        }

        this.dialogoReferencia.close(nuevaUnidad);
    } else {
        this.mostrarAlerta("Formulario no válido", "X");
    }
}


  
  onCancel() {
    this.dialogoReferencia.close();
  }

  patchFormValues(unidad: Unidad) {
    this.formUnidad.patchValue({
      marca: unidad.marca,
      modelo: unidad.modelo, 
      ruedas: unidad.ruedas.length, 
      valoracion: unidad.valoracion,
    });
  }

  mostrarAlertaWindow(mensaje: string) {
    window.alert(mensaje); 
  }

  mostrarAlerta(msg: string, accion: string) {
    this.snackBar.open(msg, accion, {
      verticalPosition: "bottom",
      horizontalPosition: "center",
      duration: 3000
    });
  }
}
