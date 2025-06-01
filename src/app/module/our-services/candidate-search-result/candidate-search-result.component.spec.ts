import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSearchResultComponent } from './candidate-search-result.component';

describe('CandidateSearchResultComponent', () => {
  let component: CandidateSearchResultComponent;
  let fixture: ComponentFixture<CandidateSearchResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateSearchResultComponent]
    });
    fixture = TestBed.createComponent(CandidateSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
