import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHComponent } from './tabla-h.component';

describe('TablaHComponent', () => {
  let component: TablaHComponent;
  let fixture: ComponentFixture<TablaHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaHComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
