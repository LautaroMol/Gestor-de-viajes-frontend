import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { TotalsCardsComponent } from '../totals-cards/totals-cards.component';

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [MatCardModule, TotalsCardsComponent],
  templateUrl: './viajes.component.html',
  styleUrl: './viajes.component.css'
})
export class ViajesComponent {

}
