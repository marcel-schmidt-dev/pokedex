import {
  Component,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { TypeIconComponent } from '../type-icon/type-icon.component';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, TypeIconComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PokemonListComponent {
  @Input() pokemonList?: Pokemon[];
  @Output() pokemonSelected = new EventEmitter<Pokemon>();

  constructor(public pokemonService: PokemonService) {}

  ngOnInit(): void {
    console.log(this.pokemonList);
  }

  onPokemonClick(pokemon: Pokemon): void {
    this.pokemonSelected.emit(pokemon);
  }
}
