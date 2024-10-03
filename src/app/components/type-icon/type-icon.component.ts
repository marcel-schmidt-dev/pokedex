import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Component to display an icon based on the Pokémon type.
 *
 * This component is designed to take in a Pokémon type as input and display an icon accordingly.
 *
 * @example
 * <app-type-icon [type]="'fire'"></app-type-icon>
 *
 * @export
 * @class TypeIconComponent
 */
@Component({
  selector: 'app-type-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-icon.component.html',
})
export class TypeIconComponent {
  /**
   * The type of the Pokémon, such as 'fire', 'water', or 'grass'.
   * The component will display the corresponding icon based on this input.
   *
   * @type {string}
   * @memberof TypeIconComponent
   */
  @Input() type!: string;
}
