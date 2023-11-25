import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAbsenceDayComponent } from './my-absence-day.component';

describe('MyAbsenceDayComponent', () => {
  let component: MyAbsenceDayComponent;
  let fixture: ComponentFixture<MyAbsenceDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAbsenceDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAbsenceDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
