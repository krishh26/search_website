import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItSubcontractingRegistrationComponent } from './it-subcontracting-registration.component';

describe('ItSubcontractingRegistrationComponent', () => {
  let component: ItSubcontractingRegistrationComponent;
  let fixture: ComponentFixture<ItSubcontractingRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItSubcontractingRegistrationComponent]
    });
    fixture = TestBed.createComponent(ItSubcontractingRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
