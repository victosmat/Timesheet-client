import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveBonusComponent } from './save-bonus.component';

describe('SaveBonusComponent', () => {
  let component: SaveBonusComponent;
  let fixture: ComponentFixture<SaveBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveBonusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
