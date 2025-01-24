import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTranslationComponent } from './select-translation.component';

describe('SelectTranslationComponent', () => {
  let component: SelectTranslationComponent;
  let fixture: ComponentFixture<SelectTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTranslationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
