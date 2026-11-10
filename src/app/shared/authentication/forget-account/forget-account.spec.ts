import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetAccount } from './forget-account';

describe('ForgetAccount', () => {
  let component: ForgetAccount;
  let fixture: ComponentFixture<ForgetAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetAccount],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
