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
 * Component to display detailed information about a Pokémon.
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
  styleUrls: ['./pokemon-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PokemonDetailComponent {
  /**
   * The Pokémon to display details for.
   */
  @Input() pokemon!: Pokemon;
  @Input() pokemonList!: Pokemon[];

  /**
   * Event emitted when the detail view is closed.
   */
  @Output() closeDetail = new EventEmitter();

  /**
   * The currently active details section.
   */
  detailsActive: String = '';

  currentIndex: number = 0;

  constructor(public pokemonService: PokemonService) {}

  /**
   * Sets the active details section based on the provided data type.
   * @param dataType - The type of data to be displayed in the details section.
   */
  onDetailsButtonClick(dataType: string): void {
    this.detailsActive = dataType;
  }

  /**
   * Emits an event to close the detail view.
   */
  onDetailClose() {
    this.closeDetail.emit();
  }

  /**
   * Resets the active details section.
   */
  onCloseClick() {
    this.detailsActive = '';
  }

  /**
   * Converts the height from decimeters to meters and returns it as a string.
   * @param height - The height in decimeters.
   * @returns A string representing the height in meters.
   */
  returnHeightInMeters(height: number): string {
    return height / 10 + ' m';
  }

  /**
   * Converts the weight from hectograms to kilograms and returns it as a string.
   * @param weight - The weight in hectograms.
   * @returns A string representing the weight in kilograms.
   */
  returnWeightInKg(weight: number): string {
    return weight / 10 + ' kg';
  }

  /**
   * Returns all moves that the Pokémon can learn in the Red/Blue versions.
   * @returns An array of move names.
   */
  /**
   * Returns all move objects that the Pokémon can learn in the Red/Blue versions.
   * @returns An array of move objects.
   */
  getRedBlueMoves(): any[] {
    return this.pokemon.moves.filter((move: { version_group_details: any[] }) =>
      move['version_group_details'].some(
        (detail: any) => detail.version_group.name === 'red-blue'
      )
    );
  }

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
