import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamOverviewComponent } from './team-overview.component';

describe('TeamOverviewComponent', () => {
  let component: TeamOverviewComponent;
  let fixture: ComponentFixture<TeamOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamOverviewComponent]
    });
    fixture = TestBed.createComponent(TeamOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
