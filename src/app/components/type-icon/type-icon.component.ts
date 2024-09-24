import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-type-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-icon.component.html',
})
export class TypeIconComponent {
  @Input() type!: string;
}
