import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRollerComponent } from './date-roller.component';

describe('DateRollerComponent', () => {
  let component: DateRollerComponent;
  let fixture: ComponentFixture<DateRollerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateRollerComponent]
    });
    fixture = TestBed.createComponent(DateRollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
