import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Unidad } from '../../Interfaces/unidad';
import { UnidadService } from '../../Services/unidad.service';

@Component({
  selector: 'app-camion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camion.component.html',
  styleUrls: ['./camion.component.css']
})
export class CamionComponent implements OnInit {
  unidad: Unidad | null = null;
  selectedWheel: number | null = null;
  oilBarrelColor: string = '#e8eaed'; 
  oilAnimation: string = '';           
  showWarning: boolean = false;

  constructor(private unidadService: UnidadService) {}

  ngOnInit(): void {
    this.getCamion(1); // Se busca la unidad por id
  }

  getCamion(id: number): void {
    this.unidadService.get(id).subscribe(data => {
      this.unidad = data;
      this.updateOilBarrel(); // Llama a la función después de que los datos se cargan
    });
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
    let oilLevel = 0;
    if (this.unidad != null){
      oilLevel = Math.max(0, (maxKm - this.unidad.kmAceite) / maxKm);
    }
    return oilLevel * 100; // Retorna el porcentaje del llenado
  }

  updateOilBarrel() {
    if (this.unidad) {
      const kmAceite = this.unidad.kmAceite;
      const oilLevel = 1 - (kmAceite / 50000);

      // Modificar el color del barril según el nivel
      this.oilBarrelColor = `rgba(0, 0, 255, ${oilLevel})`;  // Cuanto mayor el kilometraje, más vacío el barril (menos azul)

      // Mostrar advertencia si está cerca de 50,000 km
      if (kmAceite >= 45000) {
        this.showWarning = true;
        this.oilAnimation = 'blink 1s infinite';  // Activar parpadeo
      } else {
        this.showWarning = false;
        this.oilAnimation = '';  // Desactivar parpadeo
      }
    }
  }
}
