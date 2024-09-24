import { Component, Input } from '@angular/core';
import { Move } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-detail-moves',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-moves.component.html',
  styleUrl: './detail-moves.component.scss',
})
export class DetailMovesComponent {
  @Input() moves?: Move[];
  filteredMoves: Move[] = [];
  activeTab = 'level';

  constructor(public pokemonService: PokemonService) {}

  ngOnInit() {
    if (this.moves && this.activeTab === 'level') {
      this.filteredMoves = this.returnMovesLearnedByLevel(this.moves);
    }
  }

  ngOnChanges() {
    if (this.moves && this.activeTab === 'level') {
      this.filteredMoves = this.returnMovesLearnedByLevel(this.moves);
    } else if (this.moves && this.activeTab === 'machine') {
      this.filteredMoves = this.returnMovesLearnedByMachine(this.moves);
    }
  }

  private isMoveLearnedByLevelUp(move: Move): boolean {
    return move.version_group_details.some(
      (detail) => detail.move_learn_method.name === 'level-up'
    );
  }

  private compareMovesByLevelLearnedAt(a: Move, b: Move): number {
    const levelA = a.version_group_details[0]?.level_learned_at || 0;
    const levelB = b.version_group_details[0]?.level_learned_at || 0;

    return levelA - levelB;
  }

  private returnMovesLearnedByLevel(moves: Move[]): Move[] {
    return moves
      .filter((move) => this.isMoveLearnedByLevelUp(move))
      .sort(this.compareMovesByLevelLearnedAt);
  }

  returnMovesLearnedByMachine(moves: Move[]): Move[] {
    return moves.filter((move) =>
      move.version_group_details.some(
        (detail) => detail.move_learn_method.name === 'machine'
      )
    );
  }

  handleTabChange(tab: string): void {
    this.activeTab = tab;
  }
}
