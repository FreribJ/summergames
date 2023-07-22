import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EastereggsComponent } from './eastereggs.component';

describe('EastereggsComponent', () => {
  let component: EastereggsComponent;
  let fixture: ComponentFixture<EastereggsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EastereggsComponent]
    });
    fixture = TestBed.createComponent(EastereggsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
