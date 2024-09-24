import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart, ChartType, scales } from 'chart.js/auto';

@Component({
  selector: 'app-detail-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-stats.component.html',
  styleUrls: ['./detail-stats.component.scss'],
})
export class DetailStatsComponent {
  chart: Chart | undefined;

  ngOnInit(): void {
    if (this.chart === undefined) {
      this.initializeChart();
    }
  }

  private initializeChart(): void {
    const ctx = document.getElementById('statChart') as HTMLCanvasElement;
    const data = {
      labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
      datasets: [
        {
          label: 'Activities',
          data: [20, 10, 4, 2],
          borderColor: 'rgba(255, 255, 255, 1)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
      ],
    };

    const config = {
      type: 'radar' as ChartType,
      data: data,
      options: {
        elements: {
          line: {
            borderWidth: 2,
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
}
