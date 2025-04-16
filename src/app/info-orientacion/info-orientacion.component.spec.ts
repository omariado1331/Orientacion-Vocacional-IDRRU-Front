import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoOrientacionComponent } from './info-orientacion.component';

describe('InfoOrientacionComponent', () => {
  let component: InfoOrientacionComponent;
  let fixture: ComponentFixture<InfoOrientacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoOrientacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoOrientacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
