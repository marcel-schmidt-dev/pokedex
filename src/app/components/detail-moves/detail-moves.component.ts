import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Move } from 'pokeapi-js-wrapper';

/**
 * @component DetailMovesComponent
 * @description
 * The `DetailMovesComponent` is responsible for displaying and filtering the moves of a Pokémon based on the selected tab.
 * It supports filtering moves learned by level-up or by machine.
 *
 * @example
 * <app-detail-moves [moves]="pokemonMoves"></app-detail-moves>
 *
 * @export
 * @class DetailMovesComponent
 */
@Component({
  selector: 'app-detail-moves',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-moves.component.html',
  styleUrls: ['./detail-moves.component.scss'],
})
export class DetailMovesComponent {
  /**
   * The list of moves available for the Pokémon.
   *
   * @type {Move[]}
   * @memberof DetailMovesComponent
   */
  @Input() moves?: Move[];

  /**
   * The list of moves filtered based on the active tab.
   *
   * @type {Move[]}
   * @memberof DetailMovesComponent
   */
  filteredMoves: Move[] = [];

  /**
   * The currently active tab for filtering moves. Default is 'level'.
   *
   * @type {string}
   * @memberof DetailMovesComponent
   */
  activeTab = 'level';

  /**
   * Constructor for the DetailMovesComponent.
   *
   * @param {PokemonService} pokemonService - The service used to fetch Pokémon data.
   * @memberof DetailMovesComponent
   */
  constructor(public pokemonService: PokemonService) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Implements `OnInit` interface.
   *
   * This method filters the moves based on the active tab. If the active tab is 'level',
   * it filters the moves to only include those learned by level.
   *
   * @memberof DetailMovesComponent
   */
  ngOnInit(): void {
    if (this.moves && this.activeTab === 'level') {
      this.filteredMoves = this.returnMovesLearnedByLevel(this.moves);
    }
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   *
   * This method filters the moves based on the active tab. If the active tab is 'level',
   * it filters the moves learned by level. If the active tab is 'machine', it filters
   * the moves learned by machine.
   *
   * @memberof DetailMovesComponent
   */
  ngOnChanges(): void {
    if (this.moves && this.activeTab === 'level') {
      this.filteredMoves = this.returnMovesLearnedByLevel(this.moves);
    } else if (this.moves && this.activeTab === 'machine') {
      this.filteredMoves = this.returnMovesLearnedByMachine(this.moves);
    }
  }

  /**
   * Determines if a move is learned by leveling up.
   *
   * @param {Move} move - The move to check.
   * @returns {boolean} - Returns `true` if the move is learned by leveling up, otherwise `false`.
   * @memberof DetailMovesComponent
   */
  isMoveLearnedByLevelUp(move: Move): boolean {
    return move['version_group_details'].some(
      (detail: { move_learn_method: { name: string } }) =>
        detail.move_learn_method.name === 'level-up'
    );
  }

  /**
   * Compares two moves based on the level they are learned at.
   *
   * @param {Move} a - The first move to compare.
   * @param {Move} b - The second move to compare.
   * @returns {number} - A negative number if the first move is learned at a lower level,
   *                     a positive number if the first move is learned at a higher level,
   *                     or zero if both moves are learned at the same level.
   * @memberof DetailMovesComponent
   */
  compareMovesByLevelLearnedAt(a: Move, b: Move): number {
    const levelA = a['version_group_details'][0]?.level_learned_at || 0;
    const levelB = b['version_group_details'][0]?.level_learned_at || 0;
    return levelA - levelB;
  }

  /**
   * Returns a list of moves that are learned by leveling up, sorted by the level at which they are learned.
   *
   * @param {Move[]} moves - The array of moves to filter and sort.
   * @returns {Move[]} - The filtered and sorted array of moves.
   * @memberof DetailMovesComponent
   */
  returnMovesLearnedByLevel(moves: Move[]): Move[] {
    return moves
      .filter((move) => this.isMoveLearnedByLevelUp(move))
      .sort(this.compareMovesByLevelLearnedAt);
  }

  /**
   * Filters and returns the moves that are learned by machine.
   *
   * @param {Move[]} moves - An array of move objects to be filtered.
   * @returns {Move[]} - An array of moves that are learned by machine.
   * @memberof DetailMovesComponent
   */
  returnMovesLearnedByMachine(moves: Move[]): Move[] {
    return moves.filter((move) =>
      move['version_group_details'].some(
        (detail: { move_learn_method: { name: string } }) =>
          detail.move_learn_method.name === 'machine'
      )
    );
  }

  /**
   * Handles the change of the active tab.
   *
   * @param {string} tab - The name of the tab to be activated.
   * @memberof DetailMovesComponent
   */
  handleTabChange(tab: string): void {
    this.activeTab = tab;
  }
}
