import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouContactUsComponent } from './thank-you-contact-us.component';

describe('ThankYouContactUsComponent', () => {
  let component: ThankYouContactUsComponent;
  let fixture: ComponentFixture<ThankYouContactUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThankYouContactUsComponent]
    });
    fixture = TestBed.createComponent(ThankYouContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
