import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-cry-player',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-cry-player.component.html',
  styleUrls: ['./pokemon-cry-player.component.scss'],
})
export class PokemonCryPlayerComponent implements OnInit {
  @Input() cries?: { [key: string]: string };
  @ViewChild('visualizer', { static: true }) svgRef!: ElementRef<SVGElement>;

  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private audio: HTMLAudioElement | undefined;
  private dataArray!: Uint8Array;
  private bufferLength!: number;

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

  setupVisualizer(): void {
    const svg = this.svgRef.nativeElement;
    const barWidth = svg.clientWidth / this.bufferLength;

    // Create rect elements for each frequency bin
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
