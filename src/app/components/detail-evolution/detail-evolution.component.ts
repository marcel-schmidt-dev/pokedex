import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-detail-evolution',
  standalone: true,
  imports: [],
  templateUrl: './detail-evolution.component.html',
  styleUrl: './detail-evolution.component.scss',
})
export class DetailEvolutionComponent {
  @Input() pokemonName!: string;
  @Output() hasMultipleEvolutions = new EventEmitter<boolean>();
  evolutionChain: any;
  species: any;
  evolutions: {
    species_name: string;
    species_sprite: string;
    level_to_evolve: number | null;
    stone: string | null;
  }[] = [];

  constructor(private pokemonService: PokemonService) {}

  async ngOnInit() {
    this.species = await this.pokemonService.getPokemonSpecies(
      this.pokemonName
    );

    this.evolutionChain = await this.pokemonService.getEvolutionChain(
      this.species.evolution_chain.url.split('/')[6]
    );

    this.evolutions = this.getEvolutions();

    if (this.evolutions.length > 1) {
      this.hasMultipleEvolutions.emit(true);
    }

    console.log(this.evolutions);
  }

  getEvolutions() {
    const evolutions: any[] = [];
    let chain = this.evolutionChain.chain;

    const addEvolution = (chain: any) => {
      const speciesId = parseInt(chain.species.url.split('/')[6]);
      if (speciesId <= 151) {
        const evolutionDetails = chain.evolution_details[0] || {};
        const item = evolutionDetails.item ? evolutionDetails.item.name : null;
        evolutions.push({
          species_name: chain.species.name,
          species_sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${speciesId}.png`,
          level_to_evolve: evolutionDetails.min_level || null,
          stone: item,
        });
      }
    };

    const traverseChain = (chain: any) => {
      addEvolution(chain);
      chain.evolves_to.forEach(traverseChain);
    };

    traverseChain(chain);

    return evolutions;
  }
}
