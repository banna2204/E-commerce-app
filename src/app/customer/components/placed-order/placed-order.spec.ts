import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacedOrder } from './placed-order';

describe('PlacedOrder', () => {
  let component: PlacedOrder;
  let fixture: ComponentFixture<PlacedOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacedOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(PlacedOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
