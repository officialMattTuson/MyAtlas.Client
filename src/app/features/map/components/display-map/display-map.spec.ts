import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMap } from './display-map';

describe('DisplayMap', () => {
  let component: DisplayMap;
  let fixture: ComponentFixture<DisplayMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayMap],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
