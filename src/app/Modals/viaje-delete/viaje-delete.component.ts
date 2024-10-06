import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Viaje } from '../../Interfaces/viaje';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-viaje-delete',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './viaje-delete.component.html',
  styleUrl: './viaje-delete.component.css',
})
export class ViajeDeleteComponent implements OnInit {
  	constructor(
		private snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<ViajeDeleteComponent>,
		@Inject(MAT_DIALOG_DATA) public dataViaje: Viaje
	) {}
	
	ngOnInit(): void {}
	
	confirmacion() {
		if (this.dataViaje) {
			this.mostrarAlerta("Viaje Eliminado Correctamente", "X")
			this.dialogRef.close("Eliminar");
		}
	}
	
	onCancel() {
		this.dialogRef.close();
	}
	
	mostrarAlerta(msg: string, accion: string) {
		this.snackBar.open( msg, accion, {
			verticalPosition:"bottom",
			horizontalPosition:"center",
			duration: 3000
		});
	}
}
