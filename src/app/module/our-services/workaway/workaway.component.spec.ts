import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkawayComponent } from './workaway.component';

describe('WorkawayComponent', () => {
  let component: WorkawayComponent;
  let fixture: ComponentFixture<WorkawayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkawayComponent]
    });
    fixture = TestBed.createComponent(WorkawayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
