import { Component } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { RouterOutlet } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { CommonModule } from '@angular/common';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { DetailStatsComponent } from './components/detail-stats/detail-stats.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Pokemon } from 'pokeapi-js-wrapper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,
    LoadingIndicatorComponent,
    CommonModule,
    PokemonDetailComponent,
    DetailStatsComponent,
    SearchBarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  pokemonList!: Pokemon[];
  filteredPokemonList!: Pokemon[];
  isLoading: boolean = true;
  progress: number = 0;
  totalPokemon: number = 151;
  pokemonPerPage: number = 12;
  currentPage: number = 1;
  selectedPokemon!: Pokemon | null;
  searchTerm: string = '';

  constructor(private pokemonService: PokemonService) {}

  loadPokemonList(): void {
    this.isLoading = true;
    this.progress = 0;

    this.pokemonService
      .getPokemonList(151, (progress: number) => {
        this.progress = parseInt(progress.toFixed(0)) + 1;
      })
      .then((response: Pokemon[]) => {
        this.pokemonList = response;
        this.filteredPokemonList = response;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error fetching Pokémon list:', error);
        this.isLoading = false;
      });
  }

  onPokemonSelected(pokemon: Pokemon): void {
    this.selectedPokemon = pokemon;
  }

  closeDetailView(): void {
    this.selectedPokemon = null;
  }

  ngOnInit(): void {
    this.loadPokemonList();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filteredPokemonList = this.pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
