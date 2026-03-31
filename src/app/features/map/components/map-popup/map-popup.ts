import { Component, input } from '@angular/core';
import { Memory } from '../../../memories/models/memory-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-map-popup',
  imports: [DatePipe],
  templateUrl: './map-popup.html',
  styleUrl: './map-popup.scss',
})
export class MapPopup {
  memory = input.required<Memory>();
}
