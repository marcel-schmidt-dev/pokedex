import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
})
export class PokemonDetailComponent {
  @Input() pokemon!: Pokemon;
  @Output() closeDetail = new EventEmitter();

  getFormattedId(id: number): string {
    return String(id).padStart(4, '0');
  }

  onDetailClose() {
    this.closeDetail.emit();
  }
}
