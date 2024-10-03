import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailStatsComponent } from '../detail-stats/detail-stats.component';
import { DetailDescriptionComponent } from '../detail-description/detail-description.component';
import { TypeIconComponent } from '../type-icon/type-icon.component';
import { PokemonService } from '../../services/pokemon.service';
import { DetailMovesComponent } from '../detail-moves/detail-moves.component';
import { DetailEvolutionComponent } from '../detail-evolution/detail-evolution.component';
import { Pokemon } from 'pokeapi-js-wrapper';
import { PokemonCryPlayerComponent } from '../pokemon-cry-player/pokemon-cry-player.component';

/**
 * @component
 * @name PokemonDetailComponent
 * @description
 * This component is responsible for displaying detailed information about a specific Pokémon.
 * It provides functionalities to switch between different sections of details, close the detail view,
 * and navigate between different Pokémon in the list.
 *
 * @example
 * <app-pokemon-detail [pokemon]="selectedPokemon" [pokemonList]="pokemonList" (closeDetail)="onCloseDetail()"></app-pokemon-detail>
 *
 * @export
 * @class PokemonDetailComponent
 */
@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    DetailStatsComponent,
    DetailDescriptionComponent,
    TypeIconComponent,
    DetailMovesComponent,
    DetailEvolutionComponent,
    PokemonCryPlayerComponent,
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: [
    './pokemon-detail.component.scss',
    './pokemon-detail-data.component.scss',
    './pokemon-detail-controls.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PokemonDetailComponent {
  /**
   * The Pokémon whose details are displayed in this component.
   *
   * @type {Pokemon}
   * @memberof PokemonDetailComponent
   */
  @Input() pokemon!: Pokemon;

  /**
   * The list of Pokémon available for navigation.
   *
   * @type {Pokemon[]}
   * @memberof PokemonDetailComponent
   */
  @Input() pokemonList!: Pokemon[];

  /**
   * Event emitted when the detail view is closed.
   *
   * @type {EventEmitter<void>}
   * @memberof PokemonDetailComponent
   */
  @Output() closeDetail = new EventEmitter<void>();

  /**
   * The currently active details section (e.g., stats, moves, evolution).
   *
   * @type {string}
   * @memberof PokemonDetailComponent
   */
  detailsActive: string = '';

  /**
   * The current index of the Pokémon being displayed.
   *
   * @type {number}
   * @memberof PokemonDetailComponent
   */
  currentIndex: number = 0;

  /**
   * Constructor for the PokemonDetailComponent.
   *
   * @param {PokemonService} pokemonService - The service used to fetch Pokémon data.
   * @memberof PokemonDetailComponent
   */
  constructor(public pokemonService: PokemonService) {}

  /**
   * Handles the click event for the details button.
   * Sets the active details section based on the provided data type.
   *
   * @param {string} dataType - The type of data to be displayed in the details section.
   * @memberof PokemonDetailComponent
   *
   * @example
   * ```typescript
   * onDetailsButtonClick('stats');
   * ```
   */
  onDetailsButtonClick(dataType: string): void {
    this.detailsActive = dataType;
  }

  /**
   * Emits an event to close the detail view of the Pokémon.
   * @fires closeDetail
   * @memberof PokemonDetailComponent
   */
  onDetailClose(): void {
    this.closeDetail.emit();
  }

  /**
   * Resets the active details section and closes the Pokémon detail view.
   *
   * @memberof PokemonDetailComponent
   */
  onCloseClick(): void {
    this.detailsActive = '';
  }

  /**
   * Converts the height of a Pokémon from decimeters to meters and returns it as a string.
   *
   * @param {number} height - The height of the Pokémon in decimeters.
   * @returns {string} The height of the Pokémon in meters followed by ' m'.
   * @memberof PokemonDetailComponent
   */
  returnHeightInMeters(height: number): string {
    return height / 10 + ' m';
  }

  /**
   * Converts the weight of a Pokémon from hectograms to kilograms and returns it as a string.
   *
   * @param {number} weight - The weight of the Pokémon in hectograms.
   * @returns {string} The weight of the Pokémon in kilograms followed by ' kg'.
   * @memberof PokemonDetailComponent
   */
  returnWeightInKg(weight: number): string {
    return weight / 10 + ' kg';
  }

  /**
   * Returns all moves that the Pokémon can learn in the Red/Blue versions.
   *
   * @returns {any[]} An array of move objects that can be learned in the Red/Blue versions.
   * @memberof PokemonDetailComponent
   */
  getRedBlueMoves(): any[] {
    return this.pokemon.moves.filter((move: { version_group_details: any[] }) =>
      move.version_group_details.some(
        (detail: any) => detail.version_group.name === 'red-blue'
      )
    );
  }

  /**
   * Changes the currently selected Pokémon in the list based on the given direction.
   *
   * @param {string} direction - The direction to change the Pokémon.
   *                             Accepts 'previous' to move to the previous Pokémon
   *                             and 'next' to move to the next Pokémon.
   *
   * @remarks
   * - If the direction is 'previous' and the current Pokémon is not the first in the list,
   *   it will change to the previous Pokémon.
   * - If the direction is 'next' and the current Pokémon is not the last in the list,
   *   it will change to the next Pokémon.
   *
   * @memberof PokemonDetailComponent
   *
   * @example
   * // Assuming the current Pokémon is at index 1 in a list of 3 Pokémon:
   * changePokemon('previous'); // Changes to the Pokémon at index 0
   * changePokemon('next');     // Changes to the Pokémon at index 2
   */
  changePokemon(direction: string): void {
    this.currentIndex = this.pokemonList.indexOf(this.pokemon);
    if (direction === 'previous' && this.currentIndex > 0) {
      this.pokemon = this.pokemonList[this.currentIndex - 1];
      this.currentIndex--;
    } else if (
      direction === 'next' &&
      this.currentIndex < this.pokemonList.length - 1
    ) {
      this.pokemon = this.pokemonList[this.currentIndex + 1];
      this.currentIndex++;
    }
  }
}
