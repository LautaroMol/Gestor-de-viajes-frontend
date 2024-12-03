import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Unidad } from '../../Interfaces/unidad';
import { UnidadService } from '../../Services/unidad.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UnidadFormComponent } from '../../Modals/unidad-form/unidad-form.component';
import { Amortizacion } from '../../Interfaces/amortizacion';
import { AmortizacionService } from '../../Services/amortizacion.service';
import { UnidadModFormComponent } from '../../Modals/unidad-mod-form/unidad-mod-form.component';
import { data } from '@maptiler/sdk';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-camion',
	standalone: true,
	imports: [CommonModule,MatDialogModule],
	templateUrl: './camion.component.html',
  	styleUrls: ['./camion.component.css']
})
export class CamionComponent implements OnInit {
	amortizacion: Amortizacion | null = null;
	unidad: Unidad | null = null;
	selectedWheel: number | null = null;
	showWarning: boolean = false;

	constructor(private unidadService: UnidadService,private dialog: MatDialog,
		private amortService: AmortizacionService,private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.getCamion(1); // Obtener la unidad por id
		this.getAmort(1);
	}

	getCamion(id: number): void {
		this.unidadService.get(id).subscribe(data => {
			this.unidad = data;
			this.checkOilWarning();
			this.cdr.detectChanges();
		});
	}

	getAmort(id:number) {
		this.amortService.get(id).subscribe(data =>{
			this.amortizacion = data;
			this.cdr.detectChanges();
		})
	}

	selectWheel(wheelIndex: number): void {
		this.selectedWheel = wheelIndex;
	}

	onWheelSelect(event: Event): void {
		const target = event.target as HTMLSelectElement;
		this.selectWheel(Number(target.value));

	}

	getOilLevel(): number {
		const maxKm = 50000;
		if (this.unidad != null) {
			const oilLevelPercentage = Math.max(0, (maxKm - this.unidad.kmAceite) / maxKm);
			return oilLevelPercentage * 110;
		}
		return 0;
	}

	refilOil(){
		if (this.unidad){
			this.unidad.kmAceite = 0;
			this.unidad.aceite = new Date(Date.now());
			this.unidadService.update(this.unidad).subscribe(() => {
				this.showWarning = false;
			});
		}
		this.getCamion(1);
		this.getOilLevel();
		this.cdr.detectChanges();
	}

	checkOilWarning() {
		if (this.unidad && this.unidad.kmAceite >= 45000) {
			this.showWarning = true;
		} else {
			this.showWarning = false;
		}
	}

	openDialog() {
		const dialogRef = this.dialog.open(UnidadFormComponent, {
			width: '400px',
			data: {}
		});
		dialogRef.afterClosed().subscribe(result => {
		if (result) {
				this.getCamion(1);
				this.getAmort(1);
			}
		});
  	}

	ActualizarAmort(unidad: Unidad, amort: Amortizacion){
		const dialogRef = this.dialog.open(UnidadFormComponent, {
		data: {
			unidad: unidad,
			amort: amort
		}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getCamion(1);
				this.getAmort(1);
			}
		});
	}

	ActualizarUnidad(unidad: Unidad){
		const dialogRef = this.dialog.open(UnidadModFormComponent, {
		data: {
			unidad: unidad,
		}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getCamion(1);
        this.cdr.detectChanges();
			}
		});
	}

	ChangeWheel(wheelindex: number){
		if (this.unidad){
			this.unidad.estadoRueda[wheelindex] = 0;
			this.unidadService.update(this.unidad).subscribe(() => {
                this.getCamion(1);
            });
      this.mostrarAlerta("Informe de cambio de cubierta hecho correctamente","X");
      this.cdr.detectChanges();
		}else{
      this.mostrarAlerta("No se pudo realizar el informe de cambio de rueda","X");
    }

	}

  mostrarAlerta(msg: string, accion: string) {
		this.snackBar.open( msg, accion, {
			verticalPosition:"bottom",
			horizontalPosition:"center",
			duration: 3000
		});
	}


}
