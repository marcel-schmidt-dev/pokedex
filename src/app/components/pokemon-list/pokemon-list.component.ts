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

/**
 * @component
 * @name PokemonListComponent
 * @description
 * The `PokemonListComponent` is responsible for displaying a list of Pokémon with pagination and search functionality.
 * It also handles the selection of a Pokémon and emits an event when a Pokémon is selected.
 *
 * @example
 * <app-pokemon-list
 *   [pokemonList]="pokemonList"
 *   [isLoading]="isLoading"
 *   [selectedPokemon]="selectedPokemon"
 *   (pokemonSelected)="onPokemonSelected($event)">
 * </app-pokemon-list>
 *
 * @export
 * @class PokemonListComponent
 */
@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, TypeIconComponent, SearchBarComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PokemonListComponent {
  /**
   * The list of Pokémon to display in the component.
   *
   * @type {Pokemon[]}
   * @memberof PokemonListComponent
   */
  @Input() pokemonList?: Pokemon[];

  /**
   * Indicates whether the Pokémon list is currently loading.
   *
   * @type {boolean}
   * @memberof PokemonListComponent
   */
  @Input() isLoading: boolean = true;

  /**
   * The currently selected Pokémon.
   *
   * @type {Pokemon | null}
   * @memberof PokemonListComponent
   */
  @Input() selectedPokemon?: Pokemon | null;

  /**
   * Event emitted when a Pokémon is selected from the list.
   *
   * @type {EventEmitter<Pokemon>}
   * @memberof PokemonListComponent
   */
  @Output() pokemonSelected = new EventEmitter<Pokemon>();

  /**
   * The current page of the Pokémon list.
   *
   * @type {number}
   * @memberof PokemonListComponent
   */
  currentPage: number = 1;

  /**
   * The number of Pokémon displayed per page.
   *
   * @type {number}
   * @memberof PokemonListComponent
   */
  pageSize: number = 12;

  /**
   * The total number of pages for the Pokémon list.
   *
   * @type {number}
   * @memberof PokemonListComponent
   */
  totalPages: number = 0;

  /**
   * The search term used to filter the Pokémon list.
   *
   * @type {string}
   * @memberof PokemonListComponent
   */
  searchTerm: string = '';

  /**
   * The filtered Pokémon list based on the search term.
   *
   * @type {Pokemon[]}
   * @memberof PokemonListComponent
   */
  filteredPokemonList: Pokemon[] = [];

  /**
   * The paginated Pokémon list for the current page.
   *
   * @type {Pokemon[]}
   * @memberof PokemonListComponent
   */
  paginatedPokemonList: Pokemon[] = [];

  /**
   * Constructor for the `PokemonListComponent`.
   *
   * @param {PokemonService} pokemonService - The service used to fetch Pokémon data.
   * @memberof PokemonListComponent
   */
  constructor(public pokemonService: PokemonService) {}

  /**
   * Lifecycle hook that is called after data-bound properties of the component are initialized.
   * It adjusts the page size based on the window size, sets the filtered Pokémon list,
   * calculates the total number of pages, and loads the first page of Pokémon.
   *
   * @memberof PokemonListComponent
   */
  ngOnInit(): void {
    this.adjustPageSize(window);
    this.filteredPokemonList = this.pokemonList || [];
    this.totalPages = Math.ceil(
      this.filteredPokemonList.length / this.pageSize
    );
    this.loadPage();
  }

  /**
   * Loads a specific page of the Pokémon list based on the current page and page size.
   *
   * @memberof PokemonListComponent
   */
  loadPage(): void {
    if (this.pokemonList) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedPokemonList = this.filteredPokemonList.slice(
        startIndex,
        endIndex
      );
    }
  }

  /**
   * Changes the current page and loads the corresponding Pokémon data.
   *
   * @param {number} currentPage - The page number to switch to.
   * @memberof PokemonListComponent
   *
   * @example
   * // Change to page 2
   * this.changePage(2);
   */
  changePage(currentPage: number): void {
    this.currentPage = currentPage;
    this.loadPage();
  }

  /**
   * Handles the click event on a Pokémon item and emits the `pokemonSelected` event with the selected Pokémon.
   *
   * @param {Pokemon} pokemon - The Pokémon object that was clicked.
   * @memberof PokemonListComponent
   * @emits pokemonSelected - Emits the selected Pokémon object.
   */
  onPokemonClick(pokemon: Pokemon): void {
    this.pokemonSelected.emit(pokemon);
  }

  /**
   * Handles the search functionality for the Pokémon list.
   * It filters the `pokemonList` based on the search term, updates the pagination, and loads the first page of results.
   *
   * @param {string} searchTerm - The term to search for within the Pokémon list.
   * @memberof PokemonListComponent
   *
   * @example
   * this.onSearch('pikachu');
   */
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

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * Adds an event listener to the window for resizing the page.
   *
   * @memberof PokemonListComponent
   */
  ngAfterViewInit(): void {
    window.addEventListener('resize', this.adjustPageSize.bind(this));
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Removes the resize event listener to prevent memory leaks.
   *
   * @memberof PokemonListComponent
   */
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.adjustPageSize.bind(this));
  }

  /**
   * Adjusts the page size based on the window or event target dimensions.
   * This method recalculates the total number of pages and resets the current page to the first page.
   *
   * @param {Event | Window} event - The event or window object used to determine the dimensions.
   * @memberof PokemonListComponent
   */
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
      this.pageSize = this.pokemonList ? this.pokemonList.length : 0;
    } else {
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
