import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaIComponent } from './tabla-i.component';

describe('TablaIComponent', () => {
  let component: TablaIComponent;
  let fixture: ComponentFixture<TablaIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
