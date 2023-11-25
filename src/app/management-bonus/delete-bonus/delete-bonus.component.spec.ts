import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBonusComponent } from './delete-bonus.component';

describe('DeleteBonusComponent', () => {
  let component: DeleteBonusComponent;
  let fixture: ComponentFixture<DeleteBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBonusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
