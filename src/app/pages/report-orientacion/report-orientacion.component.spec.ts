import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOrientacionComponent } from './report-orientacion.component';

describe('ReportOrientacionComponent', () => {
  let component: ReportOrientacionComponent;
  let fixture: ComponentFixture<ReportOrientacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportOrientacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportOrientacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
