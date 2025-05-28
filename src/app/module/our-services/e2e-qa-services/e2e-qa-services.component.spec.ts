import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E2eQaServicesComponent } from './e2e-qa-services.component';

describe('E2eQaServicesComponent', () => {
  let component: E2eQaServicesComponent;
  let fixture: ComponentFixture<E2eQaServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [E2eQaServicesComponent]
    });
    fixture = TestBed.createComponent(E2eQaServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
