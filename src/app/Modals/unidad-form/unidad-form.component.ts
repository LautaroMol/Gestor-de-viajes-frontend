import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { Unidad } from '../../Interfaces/unidad';

@Component({
  selector: 'app-unidad-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule],
  templateUrl: './unidad-form.component.html',
  styleUrls: ['./unidad-form.component.css']
})
export class UnidadFormComponent implements OnInit {
  formUnidadAmortizacion: FormGroup;
  montoAnual: number | null = null;
  tituloAccion: string = "Nueva Unidad y Amortización";
  botonAccion: string = "Guardar";
  fechaInicio = formatDate(new Date(), 'yyyy-MM-dd', 'en');

  constructor(
    private dialogoReferencia: MatDialogRef<UnidadFormComponent>,
    private fb: FormBuilder
  ) {
    this.formUnidadAmortizacion = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      amortizacion: [0, [Validators.required, Validators.min(1)]],
      ruedas: ['', Validators.required],
      valoracion: [0, [Validators.required, Validators.min(1)]],
      plazo: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  calcularMontoAnual() {
    if (this.formUnidadAmortizacion.valid) {
      const amortizacion = this.formUnidadAmortizacion.get('amortizacion')?.value;
      const plazo = this.formUnidadAmortizacion.get('plazo')?.value;

      if (amortizacion && plazo) {
        this.montoAnual = amortizacion / plazo;
      } else {
        this.montoAnual = null;
      }
    }
  }

  onSubmit() {
    if (this.formUnidadAmortizacion.valid) {
      const nuevaUnidad: Unidad = {
        idUnidad: 0,
        ...this.formUnidadAmortizacion.value,
        estadoRueda: [],
        kmAceite: 0,
        aceite: new Date(),
        idUsuario: 1, // Por defecto o cambiar según lógica de la app
        recaudado: 0,
      };

      // Aquí podrías hacer la lógica para guardar la unidad
      console.log('Unidad creada', nuevaUnidad);

      this.dialogoReferencia.close(nuevaUnidad);
    } else {
      console.error('Formulario no válido');
    }
  }

  onCancel() {
    this.dialogoReferencia.close();
  }
}
