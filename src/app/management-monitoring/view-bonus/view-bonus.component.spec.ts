import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBonusComponent } from './view-bonus.component';

describe('ViewBonusComponent', () => {
  let component: ViewBonusComponent;
  let fixture: ComponentFixture<ViewBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBonusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
