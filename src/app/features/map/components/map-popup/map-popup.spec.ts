import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPopup } from './map-popup';

describe('MapPopup', () => {
  let component: MapPopup;
  let fixture: ComponentFixture<MapPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(MapPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
