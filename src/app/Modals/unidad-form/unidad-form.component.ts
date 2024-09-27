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

@Component({
  selector: 'app-unidad-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule],
  templateUrl: './unidad-form.component.html',
  styleUrls: ['./unidad-form.component.css']
})
export class UnidadFormComponent implements OnInit {
  formUnidadAmortizacion: FormGroup;
  montoAnual: number = 0;
  tituloAccion: string = "Nueva Unidad y Amortización";
  botonAccion: string = "Guardar";
  fechaInicio = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  dataUnidad: Unidad | undefined;
  dataAmort: Amortizacion | undefined;
  difAmort: number = 0; // Esta variable almacena la diferencia de amortización que se sumará

  constructor(
    private dialogoReferencia: MatDialogRef<UnidadFormComponent>,
    private fb: FormBuilder,
    private unidadService: UnidadService,
    private amortizacionService: AmortizacionService,
    @Inject(MAT_DIALOG_DATA) public data: { unidad: Unidad, amort: Amortizacion }
  ) {
    this.formUnidadAmortizacion = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      amortizacion: [0, [Validators.required, Validators.min(1)]],
      ruedas: ['', Validators.required],
      valoracion: [0, [Validators.required, Validators.min(1)]],
      plazo: [null, Validators.required],
    });
    if (data) {
      this.dataUnidad = data.unidad;
      this.dataAmort = data.amort;
    }
  }

  ngOnInit(): void {
    if (this.data && this.data.unidad && this.data.amort) {
      this.patchFormValues(this.data.unidad, this.data.amort);
      this.bloquearCampos();
      this.difAmort = this.data.amort.objetivoAnual - this.data.amort.recaudado; // Diferencia inicial entre lo pagado y la amortización original
    }
  }

  calcularMontoAnual() {
    if (this.formUnidadAmortizacion.valid) {
      const amortizacion = this.formUnidadAmortizacion.get('amortizacion')?.value;
      const plazo = this.formUnidadAmortizacion.get('plazo')?.value;

      if (amortizacion && plazo) {
        this.montoAnual = amortizacion / plazo;
      } else {
        this.montoAnual = 0;
      }
    }
  }

  onSubmit() {
    if (this.formUnidadAmortizacion.valid) {
      const numeroRuedas = this.formUnidadAmortizacion.get('ruedas')?.value;
      const ruedasArray = Array.from({ length: numeroRuedas }, (_, index) => index + 1);
      const estadoRuedaArray = Array(numeroRuedas).fill(0);
      
      const nuevaUnidad: Unidad = {
        idUnidad: this.dataUnidad ? this.dataUnidad.idUnidad : 0,
        ...this.formUnidadAmortizacion.value,
        ruedas: ruedasArray, 
        estadoRueda: estadoRuedaArray, 
        kmAceite: 0,
        aceite: new Date(),
        idUsuario: 1,
        recaudado: 0,
      };

      const nuevaAmortizacion: Amortizacion = {
        idAmortizacion: this.dataAmort ? this.dataAmort.idAmortizacion : 0,
        plazo: this.formUnidadAmortizacion.get('plazo')?.value,
        periodo: 1,
        objetivo: this.formUnidadAmortizacion.get('amortizacion')?.value,
        objetivoAnual: Number.parseFloat((this.difAmort + this.montoAnual).toFixed(2)), // Sumamos la diferencia a la nueva amortización
        porcentaje: 0,
        recaudado: this.dataAmort?.recaudado ?? 0, // Mantener el monto recaudado
        fechaInicio: new Date(),
      };

      if (this.dataUnidad == null) {
        this.unidadService.add(nuevaUnidad).subscribe({
          next: (data) => {
            console.log("Unidad cargada con id: ", data.idUnidad);
          }, error: (e) => {
            this.mostrarAlerta("No se ha podido crear la unidad");
          }
        });

        this.amortizacionService.add(nuevaAmortizacion).subscribe({
          next: (data) => {
            console.log("Amortización cargada con id: ", data.idAmortizacion);
          }, error: (e) => {
            this.mostrarAlerta("No se ha podido crear la amortización");
          }
        });
      } else {
        this.amortizacionService.update(nuevaAmortizacion, nuevaAmortizacion.idAmortizacion)
          .subscribe({
            next: (data) => {
              const diferencia = nuevaAmortizacion.objetivoAnual - this.difAmort;
              this.mostrarAlerta(`La amortización se actualizó. Se añadió un valor de: ${diferencia}`);
            }, error: (e) => {
              this.mostrarAlerta("No se ha podido modificar la amortización");
            }
          });
      }
      
      this.dialogoReferencia.close(nuevaUnidad);
    } else {
      console.error('Formulario no válido');
    }
  }

  onCancel() {
    this.dialogoReferencia.close();
  }

  mostrarAlerta(mensaje: string) {
    console.log(mensaje);
    //implementar logica
  }

  patchFormValues(unidad: Unidad, amort: Amortizacion) {
    this.formUnidadAmortizacion.patchValue({
      marca: unidad.marca,
      modelo: unidad.modelo,
      amortizacion: amort.objetivo,
      ruedas: unidad.ruedas.length,
      valoracion: unidad.valoracion,
      plazo: amort.plazo,
    });

    if (amort.objetivo && amort.plazo) {
      this.montoAnual = amort.objetivo / amort.plazo;
    }
  }

  bloquearCampos() {
    this.formUnidadAmortizacion.get('marca')?.disable();
    this.formUnidadAmortizacion.get('modelo')?.disable();
    this.formUnidadAmortizacion.get('ruedas')?.disable();
    this.formUnidadAmortizacion.get('valoracion')?.disable();
  }
}
