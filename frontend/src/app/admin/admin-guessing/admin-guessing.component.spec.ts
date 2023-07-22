import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGuessingComponent } from './admin-guessing.component';

describe('AdminGuessingComponent', () => {
  let component: AdminGuessingComponent;
  let fixture: ComponentFixture<AdminGuessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGuessingComponent]
    });
    fixture = TestBed.createComponent(AdminGuessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
