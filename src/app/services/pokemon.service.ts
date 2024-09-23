import { Injectable } from '@angular/core';
import { Pokedex } from 'pokeapi-js-wrapper';
import { Pokemon } from '../models/pokemon.model';

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
    limit: number,
    offset: number,
    totalPokemon: number,
    onProgress?: (progress: number) => void
  ): Promise<Pokemon[]> {
    const adjustedLimit = Math.min(limit, totalPokemon - offset);

    const response = await this.pokeApi.getPokemonsList({
      limit: adjustedLimit,
      offset: offset,
    });
    const pokemonUrls = response.results.map((pokemon: any) => pokemon.url);

    const pokemonList: Pokemon[] = await Promise.all(
      pokemonUrls.map(async (url, index) => {
        const pokemonResponse = await fetch(url);
        const pokemonData = await pokemonResponse.json();

        if (onProgress) {
          const progress = Math.round(((index + 1) / pokemonUrls.length) * 100);
          onProgress(progress);
        }

        return pokemonData;
      })
    );

    return pokemonList;
  }

  async getPokemonLocations(name: string): Promise<any> {
    const response = await this.pokeApi.getPokemonEncounterAreasByName(name);
    const locations = response;
    return locations;
  }

  async getPokemonSpecies(name: string): Promise<any> {
    const response = await this.pokeApi.getPokemonSpeciesByName(name);
    const species = response;
    return species;
  }
}
