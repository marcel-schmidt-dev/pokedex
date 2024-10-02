import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  isActive = false;

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search.emit(input.value);
  }

  toggleActive() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      setTimeout(() => {
        const inputElement = document.querySelector(
          'input'
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        }
      }, 10);
    }
  }
}
