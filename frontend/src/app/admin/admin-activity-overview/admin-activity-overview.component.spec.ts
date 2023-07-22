import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActivityOverviewComponent } from './admin-activity-overview.component';

describe('AdminActivityOverviewComponent', () => {
  let component: AdminActivityOverviewComponent;
  let fixture: ComponentFixture<AdminActivityOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminActivityOverviewComponent]
    });
    fixture = TestBed.createComponent(AdminActivityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
