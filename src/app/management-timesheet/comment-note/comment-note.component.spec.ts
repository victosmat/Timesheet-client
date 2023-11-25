import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentNoteComponent } from './comment-note.component';

describe('CommentNoteComponent', () => {
  let component: CommentNoteComponent;
  let fixture: ComponentFixture<CommentNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
