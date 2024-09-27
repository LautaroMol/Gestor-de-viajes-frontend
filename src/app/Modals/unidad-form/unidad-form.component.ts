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
  dataUnidad: Unidad | null = null;
  dataAmort: Amortizacion | null = null;
  difAmort: number = 0; 

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

  ngOnInit() {
    if (this.dataUnidad && this.dataAmort) {
      this.difAmort = this.dataAmort.objetivo / this.dataAmort.plazo;
      this.patchFormValues(this.dataUnidad, this.dataAmort);
      this.bloquearCampos(); 
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
        objetivoAnual: this.dataAmort ? this.dataAmort.objetivoAnual : Number.parseFloat((this.montoAnual).toFixed(2)),
        porcentaje: 0,
        recaudado: this.dataAmort ? this.dataAmort.recaudado : 0, 
        fechaInicio: new Date(),
      };
  
      // Si la unidad es nueva
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
        if (this.dataAmort) {
          const diferencia = Number.parseFloat((this.montoAnual).toFixed(2)) - this.difAmort;
          
          nuevaAmortizacion.objetivoAnual = this.dataAmort.objetivoAnual + diferencia;
  
          this.amortizacionService.update(nuevaAmortizacion, nuevaAmortizacion.idAmortizacion)
            .subscribe({
              next: (data) => {
                // Mostrar la alerta con la diferencia sumada
                this.mostrarAlertaWindow(`La amortización se actualizó. Se añadió un valor de: ${diferencia.toFixed(2)} ARS`);
                console.log(data);
              }, error: (e) => {
                this.mostrarAlerta("No se ha podido modificar la amortización");
              }
            });
        }
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
    amortizacion: amort.objetivo, // Asigna el valor de amortización
    ruedas: unidad.ruedas.length, // Asigna el número de ruedas
    valoracion: unidad.valoracion,
    plazo: amort.plazo
  });
}


  bloquearCampos() {
    this.formUnidadAmortizacion.get('marca')?.disable();
    this.formUnidadAmortizacion.get('modelo')?.disable();
    this.formUnidadAmortizacion.get('ruedas')?.disable();
    this.formUnidadAmortizacion.get('valoracion')?.disable();
  }

  mostrarAlertaWindow(mensaje: string) {
    window.alert(mensaje); 
  }
}
