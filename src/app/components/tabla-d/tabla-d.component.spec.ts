import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDComponent } from './tabla-d.component';

describe('TablaDComponent', () => {
  let component: TablaDComponent;
  let fixture: ComponentFixture<TablaDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
