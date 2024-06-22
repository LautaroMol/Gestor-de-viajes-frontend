import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Gasto } from '../../Interfaces/gasto';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-gasto',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './gastos-delete.component.html',
  styleUrls: ['./gastos-delete.component.css']
})
export class DeleteGastoComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DeleteGastoComponent>,
    @Inject(MAT_DIALOG_DATA) public dataGasto: Gasto
  ) {}

  ngOnInit(): void {}

  confirmacion() {
    if (this.dataGasto) {
      this.dialogoReferencia.close("Eliminar");
    }
  }
}
