import { Component, Input } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';

/**
 * @component DetailEvolutionComponent
 * @description
 * The `DetailEvolutionComponent` is responsible for displaying the evolution details of a given Pokémon.
 * It fetches the evolution chain and species data from the Pokémon API and processes it to display the evolution stages.
 *
 * @example
 * <app-detail-evolution [pokemonName]="pikachu"></app-detail-evolution>
 *
 * @export
 * @class DetailEvolutionComponent
 */
@Component({
  selector: 'app-detail-evolution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-evolution.component.html',
  styleUrls: ['./detail-evolution.component.scss'],
})
export class DetailEvolutionComponent {
  /**
   * The name of the Pokémon for which the evolution details are to be displayed.
   *
   * @type {string}
   * @memberof DetailEvolutionComponent
   */
  @Input() pokemonName!: string;

  /**
   * The evolution chain data fetched from the Pokémon API.
   *
   * @type {any}
   * @memberof DetailEvolutionComponent
   */
  evolutionChain: any;

  /**
   * The species data fetched from the Pokémon API.
   *
   * @type {any}
   * @memberof DetailEvolutionComponent
   */
  species: any;

  /**
   * The processed evolution details to be displayed. Each evolution includes the Pokémon's name, sprite, level to evolve, and the evolution stone (if applicable).
   *
   * @type {Array<{name: string, sprite: string, level_to_evolve: number | null, stone: string | null}>}
   * @memberof DetailEvolutionComponent
   */
  evolutions: {
    name: string;
    sprite: string;
    level_to_evolve: number | null;
    stone: string | null;
  }[] = [];

  /**
   * Constructor for the `DetailEvolutionComponent`.
   * It injects the `PokemonService` to fetch species and evolution data from the Pokémon API.
   *
   * @param {PokemonService} pokemonService - The service used to fetch Pokémon data.
   * @memberof DetailEvolutionComponent
   */
  constructor(private pokemonService: PokemonService) {}

  /**
   * Lifecycle hook that is called after the component's view has been initialized.
   * It fetches the Pokémon species and evolution chain data and processes the evolution details.
   *
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   * @memberof DetailEvolutionComponent
   * @async
   *
   * @example
   * ngOnInit() {
   *   this.ngOnInit();
   * }
   */
  async ngOnInit() {
    this.species = await this.pokemonService.getPokemonSpecies(
      this.pokemonName
    );
    this.evolutionChain = await this.pokemonService.getEvolutionChain(
      this.species.evolution_chain.url.split('/')[6]
    );

    setTimeout(() => {
      this.evolutions = this.getEvolutions();
    }, 300);
  }

  /**
   * Processes the evolution chain data to extract relevant evolution details.
   * It extracts the species name, sprite, level to evolve, and evolution stone (if any) and returns an array of evolution details.
   *
   * @param {any} chain - The evolution chain data to be processed.
   * @returns {Array<{name: string, sprite: string, level_to_evolve: number | null, stone: string | null}>} - The processed evolution details.
   * @memberof DetailEvolutionComponent
   *
   * @example
   * const chain = {
   *   species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
   *   evolution_details: [{ min_level: 16, item: null }]
   * };
   * const evolutions = this.getEvolutions(chain);
   * console.log(evolutions); // [{name: 'bulbasaur', sprite: '...', level_to_evolve: 16, stone: null}]
   *
   * @remarks
   * This method only processes evolution chains for species with IDs less than or equal to 151 (the first generation of Pokémon).
   */
  getEvolutions() {
    const evolutions: any[] = [];
    let chain = this.evolutionChain.chain;

    /**
     * Adds an evolution to the `evolutions` array if the species ID is less than or equal to 151.
     *
     * @param {any} chain - The evolution chain object containing species and evolution details.
     * @returns {void}
     */
    const addEvolution = (chain: any) => {
      const speciesId = parseInt(chain.species.url.split('/')[6]);
      if (speciesId <= 151) {
        const evolutionDetails = chain.evolution_details[0] || {};
        const item = evolutionDetails.item ? evolutionDetails.item.name : null;
        evolutions.push({
          name: chain.species.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${speciesId}.png`,
          level_to_evolve: evolutionDetails.min_level || null,
          stone: item,
        });
      }
    };

    /**
     * Recursively traverses the evolution chain to add all evolutions to the `evolutions` array.
     *
     * @param {any} chain - The evolution chain object containing species and evolution details.
     * @returns {void}
     */
    const traverseChain = (chain: any) => {
      addEvolution(chain);
      chain.evolves_to.forEach(traverseChain);
    };

    traverseChain(chain);

    return evolutions;
  }
}
