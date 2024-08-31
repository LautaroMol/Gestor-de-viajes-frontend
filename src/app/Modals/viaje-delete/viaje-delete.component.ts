import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Viaje } from '../../Interfaces/viaje';

@Component({
  selector: 'app-viaje-delete',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './viaje-delete.component.html',
  styleUrl: './viaje-delete.component.css',
})
export class ViajeDeleteComponent implements OnInit {
  	constructor(
		private dialogRef: MatDialogRef<ViajeDeleteComponent>,
		@Inject(MAT_DIALOG_DATA) public dataViaje: Viaje
	) {}
	
	ngOnInit(): void {}
	
	confirmacion() {
		if (this.dataViaje) {
			this.dialogRef.close("Eliminar");
		}
	}
	
	onCancel() {
		this.dialogRef.close();
	}
}
