import { Component } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { RouterOutlet } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { CommonModule } from '@angular/common';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { DetailStatsComponent } from './components/detail-stats/detail-stats.component';
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
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  pokemonList!: Pokemon[];
  filteredPokemonList!: Pokemon[];
  isLoading: boolean = true;
  progress: number = 0;
  selectedPokemon!: Pokemon | null;
  searchTerm: string = '';

  constructor(private pokemonService: PokemonService) {}

  loadPokemonList(): void {
    this.isLoading = true;
    this.progress = 0;

    this.pokemonService
      .getPokemonList(151, (progress: number) => {
        this.progress = parseInt(progress.toFixed(0));
      })
      .then((response: Pokemon[]) => {
        this.pokemonList = response.sort((a, b) => a.id - b.id);
        this.filteredPokemonList = this.pokemonList;
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
}
