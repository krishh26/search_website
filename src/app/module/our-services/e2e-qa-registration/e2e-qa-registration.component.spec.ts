import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E2eQaRegistrationComponent } from './e2e-qa-registration.component';

describe('E2eQaRegistrationComponent', () => {
  let component: E2eQaRegistrationComponent;
  let fixture: ComponentFixture<E2eQaRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [E2eQaRegistrationComponent]
    });
    fixture = TestBed.createComponent(E2eQaRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
