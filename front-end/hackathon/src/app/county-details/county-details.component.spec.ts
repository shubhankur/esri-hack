import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountyDetailsComponent } from './county-details.component';

describe('CountyDetailsComponent', () => {
  let component: CountyDetailsComponent;
  let fixture: ComponentFixture<CountyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountyDetailsComponent]
    });
    fixture = TestBed.createComponent(CountyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
