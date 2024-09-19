import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TypeIconService } from '../../services/type-icon.service';
import { DetailStatsComponent } from '../detail-stats/detail-stats.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, DetailStatsComponent, DetailStatsComponent],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PokemonDetailComponent {
  @Input() pokemon!: Pokemon;
  @Output() closeDetail = new EventEmitter();

  detailsActive: String = '';

  constructor(
    private typeIconService: TypeIconService,
    private sanitizer: DomSanitizer
  ) {}

  getFormattedId(id: number): string {
    return String(id).padStart(4, '0');
  }

  onDetailsButtonClick(dataType: string): void {
    this.detailsActive = dataType;
  }

  onDetailClose() {
    this.closeDetail.emit();
  }

  onCloseClick() {
    this.detailsActive = '';
  }

  typeIcon(type: string): SafeHtml {
    const svg = this.typeIconService.getTypeIcon(type);
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  returnHeightInMeters(height: number): string {
    return height / 10 + ' m';
  }

  returnWeightInKg(weight: number): string {
    return weight / 10 + ' kg';
  }
}
