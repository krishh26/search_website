import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItSubPartnerSearchComponent } from './it-sub-partner-search.component';

describe('ItSubPartnerSearchComponent', () => {
  let component: ItSubPartnerSearchComponent;
  let fixture: ComponentFixture<ItSubPartnerSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItSubPartnerSearchComponent]
    });
    fixture = TestBed.createComponent(ItSubPartnerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
