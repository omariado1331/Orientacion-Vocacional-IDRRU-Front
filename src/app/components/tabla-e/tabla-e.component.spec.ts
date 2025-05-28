import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEComponent } from './tabla-e.component';

describe('TablaEComponent', () => {
  let component: TablaEComponent;
  let fixture: ComponentFixture<TablaEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
