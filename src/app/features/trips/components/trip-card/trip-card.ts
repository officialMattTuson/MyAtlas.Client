import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trip-card',
  imports: [DatePipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.scss',
})
export class TripCard {

  @Input() trip!: Trip;
  @Output() onTripSelected = new EventEmitter<Trip>();

  selectTrip(trip: Trip): void {
    this.onTripSelected.emit(trip);
  }
}
