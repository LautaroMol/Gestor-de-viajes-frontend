import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../Interfaces/cliente';
import { ClienteService } from '../../Services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
  imports: [ReactiveFormsModule]
})
export class ClienteFormComponent implements OnInit {
  formCliente: FormGroup;
  botonAccion: string = "Guardar";
  dataCliente: Cliente | null = null;

  constructor(
    private dialogoReferencia: MatDialogRef<ClienteFormComponent>,
    private fb: FormBuilder,
    private _clienteServicio: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: Cliente | null
  ) {
    this.formCliente = this.fb.group({
      razonSoc: ['', Validators.required],
      domicilio: ['', Validators.required],
      condicion: [''],
      cuit: ['', Validators.required]
    });

    if (data) {
      this.dataCliente = data;
      this.formCliente.patchValue(data);
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.formCliente.valid) {
      const cliente: Cliente = {
        idCliente: this.dataCliente ? this.dataCliente.idCliente : 0,
        razonSoc: this.formCliente.value.razonSoc,
        domicilio: this.formCliente.value.domicilio,
        condicion: this.formCliente.value.condicion,
        cuitCliente: this.formCliente.value.cuit,
        borrado: false
      };

      if (this.dataCliente == null) {
        this._clienteServicio.add(cliente).subscribe({
          next: () => {
            console.log("Cliente agregado exitosamente");
            this.dialogoReferencia.close({ action: "Creado", data: cliente });
          },
          error: () => {
            console.error("No se pudo crear el cliente");
          }
        });
      } else {
        this._clienteServicio.update(cliente, cliente.idCliente).subscribe({
          next: () => {
            console.log("Cliente actualizado correctamente");
            this.dialogoReferencia.close({ action: "Editado", data: cliente });
          },
          error: () => {
            console.error("No se pudo actualizar el cliente");
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogoReferencia.close();
  }
}
