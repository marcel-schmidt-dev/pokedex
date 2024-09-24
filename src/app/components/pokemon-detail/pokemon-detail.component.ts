import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailStatsComponent } from '../detail-stats/detail-stats.component';
import { Pokemon } from '../../models/pokemon.model';
import { DetailDescriptionComponent } from '../detail-description/detail-description.component';
import { TypeIconComponent } from '../type-icon/type-icon.component';

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

  /**
   * Event emitted when the detail view is closed.
   */
  @Output() closeDetail = new EventEmitter();

  /**
   * The currently active details section.
   */
  detailsActive: String = '';

  /**
   * Formats the given ID to a string with leading zeros to ensure it has at least 4 digits.
   * @param id - The ID to be formatted.
   * @returns A string representing the formatted ID.
   */
  getFormattedId(id: number): string {
    return String(id).padStart(4, '0');
  }

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
}
