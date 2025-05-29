import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkkawayRegistrationContactDetailsComponent } from './workkaway-registration-contact-details.component';

describe('WorkkawayRegistrationContactDetailsComponent', () => {
  let component: WorkkawayRegistrationContactDetailsComponent;
  let fixture: ComponentFixture<WorkkawayRegistrationContactDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkkawayRegistrationContactDetailsComponent]
    });
    fixture = TestBed.createComponent(WorkkawayRegistrationContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
