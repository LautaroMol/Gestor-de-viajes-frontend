import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../Interfaces/cliente';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-cliente-delete',
	standalone: true,
	imports: [MatSnackBarModule],
	templateUrl: './cliente-delete.component.html',
	styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

	constructor(
		private snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<ClienteDeleteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Cliente
	) {}

	ngOnInit(): void {}

	confirmacion() {
		if (this.data) {
			this.mostrarAlerta("Cliente Eliminado Correctamente", "X")
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
