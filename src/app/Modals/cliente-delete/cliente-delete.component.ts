import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../Interfaces/cliente';

@Component({
  selector: 'app-cliente-delete',
  standalone: true,
  imports: [],
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ClienteDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente
  ) {}

  ngOnInit(): void {
  }

  confirmacion() {
    if (this.data) {
      this.dialogRef.close("Eliminar");
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
