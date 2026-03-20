import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-display-trip',
  imports: [DatePipe],
  templateUrl: './display-trip.html',
  styleUrl: './display-trip.scss',
})
export class DisplayTrip {

  @Input() trip!: Trip;
  @Output() onTripSelected = new EventEmitter<Trip>();

  selectTrip(trip: Trip): void {
    this.onTripSelected.emit(trip);
  }
}
