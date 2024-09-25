import { Component, Input } from '@angular/core';
import { GameIndex } from '../../models/pokemon.model';

@Component({
  selector: 'app-detail-included',
  standalone: true,
  imports: [],
  templateUrl: './detail-included.component.html',
  styleUrl: './detail-included.component.scss',
})
export class DetailIncludedComponent {
  @Input() includes?: GameIndex[];
}
