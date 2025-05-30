import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E2eQaHireResourcesRegistrationsComponent } from './e2e-qa-hire-resources-registrations.component';

describe('E2eQaHireResourcesRegistrationsComponent', () => {
  let component: E2eQaHireResourcesRegistrationsComponent;
  let fixture: ComponentFixture<E2eQaHireResourcesRegistrationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [E2eQaHireResourcesRegistrationsComponent]
    });
    fixture = TestBed.createComponent(E2eQaHireResourcesRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
