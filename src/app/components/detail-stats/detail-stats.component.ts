import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { Stat, StatElement } from 'pokeapi-js-wrapper';

@Component({
  selector: 'app-detail-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-stats.component.html',
  styleUrls: ['./detail-stats.component.scss'],
})
export class DetailStatsComponent {
  chart: Chart | undefined;
  @Input() stats?: StatElement[];

  ngOnInit(): void {
    if (this.chart === undefined) {
      this.initializeChart();
    }
  }

  private initializeChart(): void {
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
