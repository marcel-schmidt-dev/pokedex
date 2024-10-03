import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

/**
 * @component SearchBarComponent
 * @description
 * The `SearchBarComponent` is responsible for handling user input in a search bar.
 * It emits the search term entered by the user and manages the active state of the search bar.
 *
 * @example
 * <app-search-bar (search)="onSearch($event)"></app-search-bar>
 *
 * @export
 * @class SearchBarComponent
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  /**
   * Event emitted when the user enters a search term.
   *
   * @type {EventEmitter<string>}
   * @memberof SearchBarComponent
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Indicates whether the search bar is active (focused) or not.
   *
   * @type {boolean}
   * @memberof SearchBarComponent
   */
  isActive = false;

  /**
   * Handles the search event triggered by the user input.
   * It extracts the value from the input element and emits it via the `search` output event.
   *
   * @param {Event} event - The input event from the search bar.
   * @emits search - Emits the search event with the input value.
   *
   * @memberof SearchBarComponent
   *
   * @example
   * <input (input)="onSearch($event)" placeholder="Search Pokémon..." />
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.emit(input.value);
  }

  /**
   * Toggles the active state of the search bar.
   * When the component becomes active, it sets a timeout to focus on the input element after a short delay.
   *
   * If the `isActive` property is set to `true`, the input field will be focused after a 10ms delay.
   *
   * @memberof SearchBarComponent
   *
   * @example
   * <button (click)="toggleActive()">Toggle Search Bar</button>
   */
  toggleActive(): void {
    this.isActive = !this.isActive;
    if (this.isActive) {
      setTimeout(() => {
        const inputElement = document.querySelector(
          'input'
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        }
      }, 10);
    }
  }
}
