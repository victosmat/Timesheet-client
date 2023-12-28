import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCheckinComponent } from './my-checkin.component';

describe('MyCheckinComponent', () => {
  let component: MyCheckinComponent;
  let fixture: ComponentFixture<MyCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCheckinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
