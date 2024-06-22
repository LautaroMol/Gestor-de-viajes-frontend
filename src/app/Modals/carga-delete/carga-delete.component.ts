import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Carga } from '../../Interfaces/carga';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-carga',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './carga-delete.component.html',
  styleUrl: './carga-delete.component.css'
})
export class DeleteCargaComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DeleteCargaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCarga: Carga
  ) {}

  ngOnInit(): void {}

  confirmacion() {
    if (this.dataCarga) {
      this.dialogoReferencia.close("Eliminar");
    }
  }
}




