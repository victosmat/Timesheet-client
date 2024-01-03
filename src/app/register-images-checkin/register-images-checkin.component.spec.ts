import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterImagesCheckinComponent } from './register-images-checkin.component';

describe('RegisterImagesCheckinComponent', () => {
  let component: RegisterImagesCheckinComponent;
  let fixture: ComponentFixture<RegisterImagesCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterImagesCheckinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterImagesCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
