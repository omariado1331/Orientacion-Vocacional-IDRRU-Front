import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAComponent } from './tabla-a.component';

describe('TablaAComponent', () => {
  let component: TablaAComponent;
  let fixture: ComponentFixture<TablaAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
