import { Component, OnInit } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { RouterOutlet } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { Pokemon } from './models/pokemon.model';
import { CommonModule } from '@angular/common';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,
    LoadingIndicatorComponent,
    CommonModule,
    PokemonDetailComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  pokemonList!: Pokemon[];
  isLoading: boolean = true;
  progress: number = 0;
  totalPokemon: number = 151;
  pokemonPerPage: number = 12;
  currentPage: number = 1;
  totalPages: number = 0;
  selectedPokemon!: Pokemon | null;

  constructor(private pokemonService: PokemonService) {}

  loadPokemonPage(page: number): void {
    const offset = (page - 1) * this.pokemonPerPage;
    this.isLoading = true;
    this.progress = 0;

    this.pokemonService
      .getPokemonList(
        this.pokemonPerPage,
        offset,
        this.totalPokemon,
        (progress) => {
          this.progress = progress;
        }
      )
      .then((response: Pokemon[]) => {
        this.pokemonList = response;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading Pokémon list', error);
        this.isLoading = false;
      });
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPokemonPage(page);
    }
  }

  onPokemonSelected(pokemon: Pokemon): void {
    this.selectedPokemon = pokemon;
  }

  closeDetailView(): void {
    this.selectedPokemon = null;
  }

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.totalPokemon / this.pokemonPerPage);
    this.loadPokemonPage(this.currentPage);
  }
}
