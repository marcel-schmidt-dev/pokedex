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
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, TypeIconComponent, SearchBarComponent],
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
  totalPages: number = 0;
  searchTerm: string = '';
  filteredPokemonList: Pokemon[] = [];
  paginatedPokemonList: Pokemon[] = [];

  ngOnInit(): void {
    this.adjustPageSize(window);
    this.filteredPokemonList = this.pokemonList || [];
    this.totalPages = Math.ceil(
      this.filteredPokemonList.length / this.pageSize
    );
    this.loadPage();
  }

  private loadPage(): void {
    if (this.pokemonList) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedPokemonList = this.filteredPokemonList.slice(
        startIndex,
        endIndex
      );
    }
  }

  changePage(currentPage: number): void {
    this.currentPage = currentPage;
    this.loadPage();
  }

  onPokemonClick(pokemon: Pokemon): void {
    this.pokemonSelected.emit(pokemon);
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    if (this.pokemonList) {
      this.filteredPokemonList = [];
      this.paginatedPokemonList = [];
      setTimeout(() => {
        this.filteredPokemonList = this.pokemonList!.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.totalPages = Math.ceil(
          this.filteredPokemonList.length / this.pageSize
        );
        this.currentPage = 1;
        this.loadPage();
      }, 10);
    }
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.adjustPageSize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.adjustPageSize.bind(this));
  }

  adjustPageSize(event: Event | Window): void {
    const width =
      event instanceof Window
        ? event.innerWidth
        : (event.target as Window).innerWidth;
    const height =
      event instanceof Window
        ? event.innerHeight
        : (event.target as Window).innerHeight;

    if (height > width) {
      // Portrait mode
      this.pageSize = this.pokemonList ? this.pokemonList.length : 0;
    } else {
      // Landscape mode
      if (width < 850) {
        this.pageSize = 4;
      } else if (width < 1150) {
        this.pageSize = 6;
      } else if (width < 1550) {
        this.pageSize = 8;
      } else if (width < 1800) {
        this.pageSize = 10;
      } else {
        this.pageSize = 12;
      }
    }

    this.totalPages = Math.ceil(
      this.filteredPokemonList.length / this.pageSize
    );
    this.currentPage = 1;
    this.loadPage();
  }
}
