import { Component, Input } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-detail-description',
  standalone: true,
  imports: [],
  templateUrl: './detail-description.component.html',
  styleUrl: './detail-description.component.scss',
})
export class DetailDescriptionComponent {
  @Input() pokemon!: string;
  species: any;
  description?: string;
  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.getPokemonSpecies(this.pokemon).then((species) => {
      this.species = species;
      this.description = species.flavor_text_entries[0].flavor_text.replace(
        '\n',
        ' '
      );
    });
  }
}
