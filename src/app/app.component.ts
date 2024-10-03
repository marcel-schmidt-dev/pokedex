/**
 * @fileoverview The main component of the Pokedex application.
 * This component is responsible for loading and displaying the list of Pokémon,
 * handling the selection of a Pokémon, and managing the loading state.
 *
 * @module AppComponent
 */

import { Component } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { RouterOutlet } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { CommonModule } from '@angular/common';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { DetailStatsComponent } from './components/detail-stats/detail-stats.component';
import { Pokemon } from 'pokeapi-js-wrapper';

/**
 * @component
 * @name AppComponent
 * @description
 * The `AppComponent` is the main component of the Pokedex application. It is responsible for managing the Pokémon list, handling user interactions such as selecting a Pokémon, searching, and managing the loading state.
 *
 * @example
 * <app-root></app-root>
 *
 * @export
 * @class AppComponent
 */
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
  /**
   * The complete list of Pokémon.
   *
   * @type {Pokemon[]}
   * @memberof AppComponent
   */
  pokemonList!: Pokemon[];

  /**
   * The filtered list of Pokémon based on the search term.
   *
   * @type {Pokemon[]}
   * @memberof AppComponent
   */
  filteredPokemonList!: Pokemon[];

  /**
   * Indicates whether the Pokémon list is currently being loaded.
   *
   * @type {boolean}
   * @memberof AppComponent
   */
  isLoading: boolean = true;

  /**
   * The progress of loading the Pokémon list, represented as a percentage (0-100).
   *
   * @type {number}
   * @memberof AppComponent
   */
  progress: number = 0;

  /**
   * The currently selected Pokémon object, or `null` if no Pokémon is selected.
   *
   * @type {Pokemon | null}
   * @memberof AppComponent
   */
  selectedPokemon!: Pokemon | null;

  /**
   * The search term used to filter the Pokémon list.
   *
   * @type {string}
   * @memberof AppComponent
   */
  searchTerm: string = '';

  /**
   * Constructor for the `AppComponent`.
   *
   * @param {PokemonService} pokemonService - The service used to fetch the Pokémon list.
   * @memberof AppComponent
   */
  constructor(private pokemonService: PokemonService) {}

  /**
   * Loads the list of Pokémon from the Pokémon service.
   *
   * This method sets the loading state to true and initializes the progress to 0.
   * It calls the `getPokemonList` method from the `pokemonService` to fetch the list of Pokémon and updates the loading progress.
   * Once the list is fetched, it sorts the Pokémon by their ID and assigns the sorted list to `pokemonList` and `filteredPokemonList`.
   * If an error occurs, it logs the error and sets the loading state to false.
   *
   * @memberof AppComponent
   * @returns {void}
   *
   * @example
   * this.loadPokemonList();
   */
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

  /**
   * Handles the event when a Pokémon is selected from the list.
   *
   * @param {Pokemon} pokemon - The selected Pokémon object.
   * @memberof AppComponent
   * @returns {void}
   *
   * @example
   * this.onPokemonSelected(selectedPokemon);
   */
  onPokemonSelected(pokemon: Pokemon): void {
    this.selectedPokemon = pokemon;
  }

  /**
   * Closes the detail view of the selected Pokémon.
   *
   * @memberof AppComponent
   * @returns {void}
   *
   * @example
   * this.closeDetailView();
   */
  closeDetailView(): void {
    this.selectedPokemon = null;
  }

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   * This method loads the Pokémon list when the component is initialized.
   *
   * @memberof AppComponent
   * @returns {void}
   *
   * @example
   * ngOnInit() {
   *   this.loadPokemonList();
   * }
   */
  ngOnInit(): void {
    this.loadPokemonList();
  }
}
