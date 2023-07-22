import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActivityResultComponent } from './admin-activity-result.component';

describe('AdminActivityResultComponent', () => {
  let component: AdminActivityResultComponent;
  let fixture: ComponentFixture<AdminActivityResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminActivityResultComponent]
    });
    fixture = TestBed.createComponent(AdminActivityResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
