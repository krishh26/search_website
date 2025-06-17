import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecourceSearchComponent } from './resource-search.component';

describe('HomePageComponent', () => {
  let component: RecourceSearchComponent;
  let fixture: ComponentFixture<RecourceSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecourceSearchComponent]
    });
    fixture = TestBed.createComponent(RecourceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
