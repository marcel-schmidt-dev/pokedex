import { Component, Input } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../..//models/pokemon.model';

@Component({
  selector: 'app-detail-evolution',
  standalone: true,
  imports: [],
  templateUrl: './detail-evolution.component.html',
  styleUrl: './detail-evolution.component.scss',
})
export class DetailEvolutionComponent {
  @Input() pokemonId!: number;
  evolutionChain: any;

  constructor(private pokemonService: PokemonService) {
    this.pokemonService.getPokemonSpecies(this.pokemonId).then((response) => {
      this.pokemonService
        .getEvolutionChain(response.evolution_chain.url)
        .then((evolutionChain) => {
          this.evolutionChain = evolutionChain;
        });
    });
  }

  ngOnInit() {
    console.log(this.evolutionChain);
  }
}
