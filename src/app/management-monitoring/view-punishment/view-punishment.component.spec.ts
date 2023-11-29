import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPunishmentComponent } from './view-punishment.component';

describe('ViewPunishmentComponent', () => {
  let component: ViewPunishmentComponent;
  let fixture: ComponentFixture<ViewPunishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPunishmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPunishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
