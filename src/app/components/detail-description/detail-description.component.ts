import { Component, Input } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { Flavor } from 'pokeapi-js-wrapper';

@Component({
  selector: 'app-detail-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-description.component.html',
  styleUrls: ['./detail-description.component.scss'],
})
export class DetailDescriptionComponent {
  @Input() pokemon!: string;
  description!: any[];

  constructor(private pokemonService: PokemonService) {}

  async ngAfterViewInit() {
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

  async scrambleTextAnimation(text: string[], ref: any) {
    let output = '';

    for (let index = 0; index < text.length; index++) {
      const originalWord = text[index];

      await this.scrambleWordWithDelay(originalWord, ref, output);

      output += originalWord + ' ';
      ref.innerHTML = output;
    }
  }

  scrambleWordWithDelay(word: string, ref: any, output: string) {
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

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  scrambleWord(word: string) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let scrambledWord = '';

    for (let i = 0; i < word.length; i++) {
      const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      scrambledWord += randomChar;
    }

    return scrambledWord;
  }
}
