import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFormRoomComponent } from './create-form-room.component';

describe('CreateFormRoomComponent', () => {
  let component: CreateFormRoomComponent;
  let fixture: ComponentFixture<CreateFormRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFormRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFormRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
