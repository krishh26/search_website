import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E2eQaRegistrationContactDetailsComponent } from './e2e-qa-registration-contact-details.component';

describe('E2eQaRegistrationContactDetailsComponent', () => {
  let component: E2eQaRegistrationContactDetailsComponent;
  let fixture: ComponentFixture<E2eQaRegistrationContactDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [E2eQaRegistrationContactDetailsComponent]
    });
    fixture = TestBed.createComponent(E2eQaRegistrationContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
