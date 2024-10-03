import { Component, Input } from '@angular/core';

/**
 * @component LoadingIndicatorComponent
 * @description
 * The `LoadingIndicatorComponent` is responsible for displaying a loading indicator with a progress bar. It takes a progress value as input and updates the visual indicator accordingly.
 *
 * @example
 * <app-loading-indicator [progress]="50"></app-loading-indicator>
 *
 * This example would display a loading indicator with the progress set to 50%.
 *
 * @export
 * @class LoadingIndicatorComponent
 */
@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [],
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent {
  /**
   * The current progress value to be displayed by the loading indicator.
   * This value should be between 0 and 100 to represent the loading state.
   *
   * @type {number}
   * @memberof LoadingIndicatorComponent
   * @example
   * // Set the progress to 75%
   * <app-loading-indicator [progress]="75"></app-loading-indicator>
   */
  @Input() progress!: number;
}
