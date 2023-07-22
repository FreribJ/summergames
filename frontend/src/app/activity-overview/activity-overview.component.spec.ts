import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityOverviewComponent } from './activity-overview.component';

describe('ActivityOverviewComponent', () => {
  let component: ActivityOverviewComponent;
  let fixture: ComponentFixture<ActivityOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityOverviewComponent]
    });
    fixture = TestBed.createComponent(ActivityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
