import {
  Component,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { TypeIconService } from '../../services/type-icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PokemonListComponent {
  @Input() pokemonList?: Pokemon[];
  @Output() pokemonSelected = new EventEmitter<Pokemon>();

  constructor(
    private typeIconService: TypeIconService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log(this.pokemonList);
  }

  getFormattedId(id: number): string {
    return String(id).padStart(4, '0');
  }

  typeIcon(type: string): SafeHtml {
    const svg = this.typeIconService.getTypeIcon(type);
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  onPokemonClick(pokemon: Pokemon): void {
    this.pokemonSelected.emit(pokemon);
  }
}
