import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-condiciones-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './condiciones-form.component.html',
  styleUrl: './condiciones-form.component.css'
})
export class CondicionesFormComponent {
  formCondicion: FormGroup;
  botonAccion: string = "Guardar";

  constructor(
    private dialogoReferencia: MatDialogRef<CondicionesFormComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { condiciones: string[] },
  ) {
    this.formCondicion = this.fb.group({
      condicion: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formCondicion.valid) {
      this.mostrarAlerta("Condición agregada correctamente", "X");
      this.dialogoReferencia.close({ action: 'Creado', data: this.formCondicion.value.condicion });
    }
  }

  onCancel() {
    this.dialogoReferencia.close();
  }

  mostrarAlerta(msg: string, accion: string) {
    this.snackBar.open(msg, accion, {
      verticalPosition: "bottom",
      horizontalPosition: "center",
      duration: 3000
    });
  }
}
