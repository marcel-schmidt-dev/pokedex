import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-stats.component.html',
  styleUrl: './detail-stats.component.scss',
})
export class DetailStatsComponent {
  @Input() stats: any;
  maxStat: number = 255;
}
