import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerSearchResultExperienceComponent } from './partner-search-result-experience.component';

describe('PartnerSearchResultExperienceComponent', () => {
  let component: PartnerSearchResultExperienceComponent;
  let fixture: ComponentFixture<PartnerSearchResultExperienceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerSearchResultExperienceComponent]
    });
    fixture = TestBed.createComponent(PartnerSearchResultExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
