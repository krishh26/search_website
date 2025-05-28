import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkawayRegistrationComponent } from './workaway-registration.component';

describe('WorkawayRegistrationComponent', () => {
  let component: WorkawayRegistrationComponent;
  let fixture: ComponentFixture<WorkawayRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkawayRegistrationComponent]
    });
    fixture = TestBed.createComponent(WorkawayRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
