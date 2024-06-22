import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from '../../Interfaces/categoria';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-categoria-delete',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './categoria-delete.component.html',
  styleUrls: ['./categoria-delete.component.css']
})
export class CategoriaDeleteComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<CategoriaDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCategoria: Categoria
  ) {}

  ngOnInit(): void {}

  confirmacion() {
    if (this.dataCategoria) {
      this.dialogoReferencia.close("Eliminar");
    }
  }
}
