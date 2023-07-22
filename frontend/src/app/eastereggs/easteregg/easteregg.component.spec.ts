import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EastereggComponent } from './easteregg.component';

describe('EastereggComponent', () => {
  let component: EastereggComponent;
  let fixture: ComponentFixture<EastereggComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EastereggComponent]
    });
    fixture = TestBed.createComponent(EastereggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
