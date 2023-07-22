import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessingComponent } from './guessing.component';

describe('GuessingComponent', () => {
  let component: GuessingComponent;
  let fixture: ComponentFixture<GuessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuessingComponent]
    });
    fixture = TestBed.createComponent(GuessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
