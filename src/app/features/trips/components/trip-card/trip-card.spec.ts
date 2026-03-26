import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTrip } from './trip-card';

describe('DisplayTrip', () => {
  let component: DisplayTrip;
  let fixture: ComponentFixture<DisplayTrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayTrip],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayTrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
