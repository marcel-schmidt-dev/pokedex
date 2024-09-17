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

    const pokemonList: Pokemon[] = [];

    for (let i = 0; i < pokemonUrls.length; i++) {
      const url = pokemonUrls[i];
      const pokemonResponse = await fetch(url);
      const pokemonData = await pokemonResponse.json();
      pokemonList.push(pokemonData);

      if (onProgress) {
        const progress = Math.round(((i + 1) / pokemonUrls.length) * 100);
        onProgress(progress);
      }
    }

    return pokemonList;
  }
}
