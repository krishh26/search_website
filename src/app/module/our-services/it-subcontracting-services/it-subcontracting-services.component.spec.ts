import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItSubcontractingServicesComponent } from './it-subcontracting-services.component';

describe('ItSubcontractingServicesComponent', () => {
  let component: ItSubcontractingServicesComponent;
  let fixture: ComponentFixture<ItSubcontractingServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItSubcontractingServicesComponent]
    });
    fixture = TestBed.createComponent(ItSubcontractingServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
