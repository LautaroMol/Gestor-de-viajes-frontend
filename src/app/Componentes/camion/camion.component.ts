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

  constructor(private unidadService: UnidadService) {}

  ngOnInit(): void {
    this.getCamion(1); // se busca por id
  }

  getCamion(id: number): void {
    this.unidadService.get(id).subscribe(data => {
      this.unidad = data;
      console.log('Camion:', this.unidad);
    });
  }

  selectWheel(wheelIndex: number): void {
    this.selectedWheel = wheelIndex;
  }

  onWheelSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectWheel(Number(target.value));
  }

  getWheelPosition(index: number, totalWheels: number) {
    const baseX = 30;
    const baseY = 120;
    const wheelSpacing = 60;

    return {
      left: `${baseX + (index * wheelSpacing)}px`,
      top: `${baseY}px`
    };
  }
}
