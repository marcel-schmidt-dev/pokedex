import { Injectable } from '@angular/core';
import { Pokedex, Pokemon } from 'pokeapi-js-wrapper';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private pokeApi: Pokedex;

  constructor() {
    this.pokeApi = new Pokedex({
      protocol: 'https',
      hostName: 'pokeapi.co',
      versionPath: '/api/v2/',
      cache: true,
      timeout: 5 * 1000,
      cacheImages: true,
    });
  }

  async getPokemonList(
    totalPokemon: number = 151,
    onProgress?: (progress: number) => void
  ): Promise<Pokemon[]> {
    const pokemonList: Pokemon[] = [];
    const promises = [];

    for (let i = 1; i <= totalPokemon; i++) {
      promises.push(
        this.pokeApi.getPokemonByName(i).then((response) => {
          pokemonList.push(response);
          if (onProgress) {
            onProgress((pokemonList.length / totalPokemon) * 100);
          }
        })
      );
    }

    await Promise.all(promises);
    return pokemonList;
  }

  async getPokemonLocations(name: string): Promise<any> {
    const response: any = await this.pokeApi.getPokemonEncounterAreasByName(
      name
    );
    const locations: any = response;
    return locations;
  }

  async getPokemonSpecies(name: string): Promise<any> {
    const response = await this.pokeApi.getPokemonSpeciesByName(name);
    const species = response;
    return species;
  }

  getFormattedId(id: number): string {
    return String(id).padStart(3, '0');
  }

  async getEvolutionChain(id: number): Promise<any> {
    const response = await this.pokeApi.getEvolutionChainById(id);
    return response;
  }
}
