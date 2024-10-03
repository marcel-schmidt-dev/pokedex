import { Component, Input } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { Flavor } from 'pokeapi-js-wrapper';

/**
 * @component
 * @name DetailDescriptionComponent
 * @description
 * The DetailDescriptionComponent is responsible for displaying the detailed description of a Pokémon.
 * It fetches the Pokémon species data and performs a text scrambling animation on the description.
 *
 * @example
 * <app-detail-description [pokemon]="pokemonName"></app-detail-description>
 *
 * @export
 * @class DetailDescriptionComponent
 */
@Component({
  selector: 'app-detail-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-description.component.html',
  styleUrls: ['./detail-description.component.scss'],
})
export class DetailDescriptionComponent {
  /**
   * The name of the Pokémon for which the description is to be fetched.
   *
   * @type {string}
   * @memberof DetailDescriptionComponent
   */
  @Input() pokemon!: string;

  /**
   * The array that holds the description text split into words.
   *
   * @type {any[]}
   * @memberof DetailDescriptionComponent
   */
  description!: any[];

  /**
   * Constructor for the DetailDescriptionComponent.
   *
   * @param {PokemonService} pokemonService - The service used to fetch Pokémon data.
   * @memberof DetailDescriptionComponent
   */
  constructor(private pokemonService: PokemonService) {}

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   *
   * This method performs the following actions:
   * 1. Selects the description element from the DOM.
   * 2. Fetches the Pokémon species data from the Pokémon service.
   * 3. Extracts and processes the English flavor text for the 'red' version.
   * 4. Replaces line breaks in the flavor text with spaces and splits the text into words.
   * 5. Waits for 500 milliseconds.
   * 6. Initiates the scramble text animation on the description element.
   *
   * @returns {Promise<void>} A promise that resolves when the method completes.
   * @memberof DetailDescriptionComponent
   */
  async ngAfterViewInit(): Promise<void> {
    const descriptionRef = document.querySelector('.description span');
    this.pokemonService
      .getPokemonSpecies(this.pokemon)
      .then((species) => {
        this.description = species.flavor_text_entries
          .find(
            (entry: Flavor) =>
              entry['language'].name === 'en' && entry['version'].name === 'red'
          )
          .flavor_text.replace(/(\r\n|\n|\r|\f)/gm, ' ')
          .split(' ');
      })
      .then(async () => {
        await this.delay(500);
        this.scrambleTextAnimation(this.description, descriptionRef);
      });
  }

  /**
   * Scrambles each word in the provided text array with a delay and updates the inner HTML of the given reference element.
   *
   * @param {string[]} text - An array of strings where each string is a word to be scrambled.
   * @param {any} ref - A reference to the HTML element whose inner HTML will be updated with the scrambled text.
   * @returns {Promise<void>} A promise that resolves when the text scrambling animation is complete.
   * @memberof DetailDescriptionComponent
   */
  async scrambleTextAnimation(text: string[], ref: any): Promise<void> {
    let output = '';

    for (let index = 0; index < text.length; index++) {
      const originalWord = text[index];

      await this.scrambleWordWithDelay(originalWord, ref, output);

      output += originalWord + ' ';
      ref.innerHTML = output;
    }
  }

  /**
   * Scrambles a given word multiple times with a delay between each scramble and updates the provided reference element's innerHTML.
   *
   * @param {string} word - The word to be scrambled.
   * @param {any} ref - The reference to the HTML element whose innerHTML will be updated.
   * @param {string} output - The initial output string to be prepended to the scrambled word.
   * @returns {Promise<void>} A promise that resolves when the scrambling is complete.
   * @memberof DetailDescriptionComponent
   */
  scrambleWordWithDelay(word: string, ref: any, output: string): Promise<void> {
    return new Promise<void>((resolve) => {
      let iterations = 0;
      const maxIterations = 4;

      const scramble = () => {
        if (iterations < maxIterations) {
          const scrambledWord = this.scrambleWord(word);
          ref.innerHTML = output + scrambledWord + ' ';
          iterations++;

          setTimeout(scramble, 50);
        } else {
          resolve();
        }
      };

      scramble();
    });
  }

  /**
   * Delays the execution for a specified number of milliseconds.
   *
   * @param {number} ms - The number of milliseconds to delay.
   * @returns {Promise<void>} A promise that resolves after the specified delay.
   *
   * @memberof DetailDescriptionComponent
   */
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Scrambles the given word by replacing each character with a random character from the alphabet.
   *
   * @param {string} word - The word to be scrambled.
   * @returns {string} - The scrambled word.
   * @memberof DetailDescriptionComponent
   */
  scrambleWord(word: string): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let scrambledWord = '';

    for (let i = 0; i < word.length; i++) {
      const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      scrambledWord += randomChar;
    }

    return scrambledWord;
  }
}
