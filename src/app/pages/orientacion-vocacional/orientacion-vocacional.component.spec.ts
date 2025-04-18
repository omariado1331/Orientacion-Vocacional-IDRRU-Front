import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientacionVocacionalComponent } from './orientacion-vocacional.component';

describe('OrientacionVocacionalComponent', () => {
  let component: OrientacionVocacionalComponent;
  let fixture: ComponentFixture<OrientacionVocacionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrientacionVocacionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrientacionVocacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
