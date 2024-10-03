/**
 * @fileoverview Provides methods to interact with the PokeAPI.
 * This service includes methods to fetch Pokémon data, their locations, species, and evolution chains.
 *
 * @module PokemonService
 */

import { Injectable } from '@angular/core';
import { Pokedex, Pokemon } from 'pokeapi-js-wrapper';

/**
 * A service to interact with the PokeAPI, including methods to fetch Pokémon data,
 * locations, species information, and evolution chains.
 *
 * @export
 * @class PokemonService
 */
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  /**
   * Instance of the PokeAPI client used to fetch Pokémon data.
   *
   * @private
   * @type {Pokedex}
   * @memberof PokemonService
   */
  private pokeApi: Pokedex;

  /**
   * Initializes the Pokedex instance with the specified configuration.
   *
   * @memberof PokemonService
   */
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

  /**
   * Fetches a list of Pokémon.
   *
   * @param {number} [totalPokemon=151] - The total number of Pokémon to fetch.
   * @param {(progress: number) => void} [onProgress] - Optional callback to track progress.
   * @returns {Promise<Pokemon[]>} A promise that resolves to an array of Pokémon.
   * @memberof PokemonService
   */
  async getPokemonList(
    totalPokemon: number = 151,
    onProgress?: (progress: number) => void
  ): Promise<Pokemon[]> {
    const pokemonList: Pokemon[] = [];
    const promises = [];

    for (let i = 1; i <= totalPokemon; i++) {
      const promise = this.pokeApi
        .getPokemonByName(i)
        .then((pokemon: Pokemon) => {
          pokemonList.push(pokemon);
          if (onProgress) {
            onProgress((i / totalPokemon) * 100);
          }
        });
      promises.push(promise);
    }

    await Promise.all(promises);
    return pokemonList;
  }

  /**
   * Fetches the encounter locations for a given Pokémon by name.
   *
   * @param {string} name - The name of the Pokémon.
   * @returns {Promise<any>} A promise that resolves to the encounter locations.
   * @memberof PokemonService
   */
  async getPokemonLocations(name: string): Promise<any> {
    const response: any = await this.pokeApi.getPokemonEncounterAreasByName(
      name
    );
    return response;
  }

  /**
   * Fetches the species information for a given Pokémon by name.
   *
   * @param {string} name - The name of the Pokémon.
   * @returns {Promise<any>} A promise that resolves to the species information.
   * @memberof PokemonService
   */
  async getPokemonSpecies(name: string): Promise<any> {
    const response = await this.pokeApi.getPokemonSpeciesByName(name);
    return response;
  }

  /**
   * Formats a Pokémon ID to a three-digit string (e.g., 001, 025, 150).
   *
   * @param {number} id - The ID of the Pokémon.
   * @returns {string} The formatted ID.
   * @memberof PokemonService
   */
  getFormattedId(id: number): string {
    return String(id).padStart(3, '0');
  }

  /**
   * Fetches the evolution chain for a given Pokémon by ID.
   *
   * @param {number} id - The ID of the evolution chain.
   * @returns {Promise<any>} A promise that resolves to the evolution chain data.
   * @memberof PokemonService
   */
  async getEvolutionChain(id: number): Promise<any> {
    const response = await this.pokeApi.getEvolutionChainById(id);
    return response;
  }
}
