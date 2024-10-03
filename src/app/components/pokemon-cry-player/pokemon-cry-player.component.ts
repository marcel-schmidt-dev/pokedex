import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';

/**
 * @component PokemonCryPlayerComponent
 * @description
 * The `PokemonCryPlayerComponent` is responsible for playing Pokémon cries and visualizing the audio frequency data using an SVG element.
 * It uses the Web Audio API to capture audio data and visualizes it in real-time with an SVG-based visualizer.
 *
 * @example
 * <app-pokemon-cry-player [cries]="pokemonCries"></app-pokemon-cry-player>
 *
 * @export
 * @class PokemonCryPlayerComponent
 */
@Component({
  selector: 'app-pokemon-cry-player',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-cry-player.component.html',
  styleUrls: ['./pokemon-cry-player.component.scss'],
})
export class PokemonCryPlayerComponent implements OnInit {
  /**
   * An object containing Pokémon cry URLs, keyed by Pokémon names.
   *
   * @type {{ [key: string]: string }}
   * @memberof PokemonCryPlayerComponent
   */
  @Input() cries?: { [key: string]: string };

  /**
   * Reference to the SVG element used for visualizing the audio frequency data.
   *
   * @type {ElementRef<SVGElement>}
   * @memberof PokemonCryPlayerComponent
   */
  @ViewChild('visualizer', { static: true }) svgRef!: ElementRef<SVGElement>;

  /**
   * The Web Audio API's AudioContext, which manages the audio pipeline.
   *
   * @type {AudioContext}
   * @private
   * @memberof PokemonCryPlayerComponent
   */
  private audioContext!: AudioContext;

  /**
   * The AnalyserNode that provides real-time frequency data of the audio being played.
   *
   * @type {AnalyserNode}
   * @private
   * @memberof PokemonCryPlayerComponent
   */
  private analyser!: AnalyserNode;

  /**
   * The HTML audio element that plays the Pokémon cry.
   *
   * @type {HTMLAudioElement | undefined}
   * @private
   * @memberof PokemonCryPlayerComponent
   */
  private audio: HTMLAudioElement | undefined;

  /**
   * A typed array that holds the frequency data for the analyser node.
   *
   * @type {Uint8Array}
   * @private
   * @memberof PokemonCryPlayerComponent
   */
  private dataArray!: Uint8Array;

  /**
   * The number of frequency bins in the analyser's frequency data.
   *
   * @type {number}
   * @private
   * @memberof PokemonCryPlayerComponent
   */
  private bufferLength!: number;

  /**
   * Lifecycle hook that initializes the audio context, analyser node, and frequency data array.
   * Sets up the environment for the audio visualizer.
   *
   * @memberof PokemonCryPlayerComponent
   */
  ngOnInit(): void {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  /**
   * Sets up the SVG visualizer by creating bars (rect elements) for each frequency bin.
   * The visualizer reflects the audio frequency data in real time.
   *
   * @memberof PokemonCryPlayerComponent
   * @returns {void}
   */
  setupVisualizer(): void {
    const svg = this.svgRef.nativeElement;
    const barWidth = svg.clientWidth / this.bufferLength;

    for (let i = 0; i < this.bufferLength; i++) {
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('class', 'bar');
      rect.setAttribute('x', (i * barWidth).toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('y', '0');
      rect.setAttribute('height', '0');
      rect.setAttribute('fill', '#00ffff');
      svg.appendChild(rect);
    }

    this.drawVisualizer();
  }

  /**
   * Continuously updates the SVG visualizer with the current frequency data from the analyser node.
   * This method runs in an animation loop to provide a real-time visualization of the audio.
   *
   * @memberof PokemonCryPlayerComponent
   * @returns {void}
   */
  drawVisualizer(): void {
    requestAnimationFrame(() => this.drawVisualizer());

    this.analyser.getByteFrequencyData(this.dataArray);

    const svg = this.svgRef.nativeElement;
    const bars = svg.querySelectorAll('rect.bar');
    const centerY = svg.clientHeight / 2;

    bars.forEach((bar, i) => {
      const value = this.dataArray[i];
      const percent = value / 255;
      const height = (svg.clientHeight * percent) / 2;
      const y = centerY - height;
      if (!isNaN(y) && !isNaN(height)) {
        bar.setAttribute('y', y.toString());
        bar.setAttribute('height', (height * 2).toString());
      }
    });
  }

  /**
   * Plays the Pokémon cry audio if available. It sets up the audio context, analyser, and visualizer, and plays the audio.
   *
   * @memberof PokemonCryPlayerComponent
   * @returns {void}
   */
  playCry(): void {
    if (this.cries) {
      if (!this.audio || this.audio.paused) {
        const audioUrl = this.cries['latest'] || '';
        this.audio = new Audio(audioUrl);
        this.audio.crossOrigin = 'anonymous';
        this.audio.addEventListener('canplay', () => {
          const source = this.audioContext.createMediaElementSource(
            this.audio!
          );
          source.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);
          this.audio!.play();
          this.setupVisualizer();
        });
        this.audio.load();
      }
    }
  }
}
