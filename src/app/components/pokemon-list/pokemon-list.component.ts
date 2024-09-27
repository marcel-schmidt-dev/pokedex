import {
  Component,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeIconComponent } from '../type-icon/type-icon.component';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from 'pokeapi-js-wrapper';

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
  @Input() isLoading: boolean = true;
  @Input() selectedPokemon?: Pokemon | null;
  @Output() pokemonSelected = new EventEmitter<Pokemon>();

  constructor(public pokemonService: PokemonService) {}

  currentPage: number = 1;
  pageSize: number = 12;
  paginatedPokemonList: Pokemon[] = [];
  totalPages: number = 0;

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.pokemonList!.length / this.pageSize);
    this.loadPage(this.currentPage);
  }

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.pokemonList!.length / this.pageSize);
    this.paginatedPokemonList = [];
    setTimeout(() => {
      this.loadPage(this.currentPage);
    }, 10);
  }

  loadPage(page: number): void {
    if (this.pokemonList) {
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedPokemonList = this.pokemonList.slice(startIndex, endIndex);
    }
  }

  changePage(currentPage: number): void {
    this.currentPage = currentPage;
    this.loadPage(currentPage);
  }

  onPokemonClick(pokemon: Pokemon): void {
    this.pokemonSelected.emit(pokemon);
  }
}
