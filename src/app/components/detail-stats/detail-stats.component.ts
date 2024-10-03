import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { Stat, StatElement } from 'pokeapi-js-wrapper';

/**
 * @component DetailStatsComponent
 * @description
 * The `DetailStatsComponent` is responsible for displaying a radar chart of Pokémon stats.
 * It initializes the chart with the provided stats and customizes the appearance of the chart.
 *
 * @example
 * <app-detail-stats [stats]="pokemonStats"></app-detail-stats>
 *
 * @export
 * @class DetailStatsComponent
 */
@Component({
  selector: 'app-detail-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-stats.component.html',
  styleUrls: ['./detail-stats.component.scss'],
})
export class DetailStatsComponent {
  /**
   * The Chart.js instance used to render the radar chart.
   *
   * @type {Chart | undefined}
   * @memberof DetailStatsComponent
   */
  chart: Chart | undefined;

  /**
   * The array of Pokémon stat elements to be displayed in the radar chart.
   *
   * @type {StatElement[] | undefined}
   * @memberof DetailStatsComponent
   */
  @Input() stats?: StatElement[];

  /**
   * Lifecycle hook that is called after the component's data-bound properties are initialized.
   * This method initializes the radar chart if it has not been created yet.
   *
   * @memberof DetailStatsComponent
   */
  ngOnInit(): void {
    if (this.chart === undefined) {
      this.initializeChart();
    }
  }

  /**
   * @method initializeChart
   * @description Initializes a radar chart displaying Pokémon stats using Chart.js.
   *
   * This method sets up the chart configuration, including data labels, datasets, and visual options.
   * It maps Pokémon stats to chart labels and values, adjusts the chart's appearance, and renders it
   * on a canvas element with the ID 'statChart'.
   *
   * @returns {void}
   *
   * @example
   * // Call this method to initialize the chart after the component has loaded.
   * this.initializeChart();
   *
   * @remarks
   * The chart labels are derived from Pokémon stat names, with special handling for 'special-defense'
   * and 'special-attack' to shorten them to 'sp. def' and 'sp. atk', respectively. The chart is rendered
   * with a radar type, and various visual customizations are applied, such as grid color, font size, and
   * background color.
   *
   * @memberof DetailStatsComponent
   */
  initializeChart(): void {
    const ctx = document.getElementById('statChart') as HTMLCanvasElement;

    const data = {
      labels:
        this.stats?.map((stat) => {
          let label = stat.stat['name'];

          if (label === 'special-defense') {
            label = 'sp. def';
          } else if (label === 'special-attack') {
            label = 'sp. atk';
          } else if (label === 'attack') {
            label = 'atk';
          } else if (label === 'defense') {
            label = 'def';
          }
          return label.toUpperCase();
        }) || [],
      datasets: [
        {
          data: this.stats?.map((stat) => stat['base_stat']) || [],
        },
      ],
    };

    const maxStatValue = Math.max(
      ...(this.stats?.map((stat) => stat['base_stat']) || [])
    );

    const config = {
      type: 'radar' as ChartType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            ticks: { display: false },
            grid: {
              color: 'rgba(0, 255, 255, 0.5)',
              lineWidth: 2,
            },
            suggestedMin: 0,
            suggestedMax: maxStatValue,
            pointLabels: {
              font: {
                size: 20,
                family: 'Orbitron-Regular',
              },
              color: 'rgba(255, 255, 255, 1)',
            },
          },
        },
        elements: {
          line: {
            borderWidth: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    setTimeout(() => {
      this.chart = new Chart(ctx, config);
    }, 300);
  }
}
