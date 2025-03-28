import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBentoComponent } from './item-bento.component';

describe('ItemBentoComponent', () => {
  let component: ItemBentoComponent;
  let fixture: ComponentFixture<ItemBentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemBentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemBentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
