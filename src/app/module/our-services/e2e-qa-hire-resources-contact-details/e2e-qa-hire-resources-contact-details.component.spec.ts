import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E2eQaHireResourcesContactDetailsComponent } from './e2e-qa-hire-resources-contact-details.component';

describe('E2eQaHireResourcesContactDetailsComponent', () => {
  let component: E2eQaHireResourcesContactDetailsComponent;
  let fixture: ComponentFixture<E2eQaHireResourcesContactDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [E2eQaHireResourcesContactDetailsComponent]
    });
    fixture = TestBed.createComponent(E2eQaHireResourcesContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
