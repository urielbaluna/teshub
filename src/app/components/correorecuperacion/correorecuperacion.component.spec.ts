import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorreorecuperacionComponent } from './correorecuperacion.component';

describe('CorreorecuperacionComponent', () => {
  let component: CorreorecuperacionComponent;
  let fixture: ComponentFixture<CorreorecuperacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorreorecuperacionComponent]
    });
    fixture = TestBed.createComponent(CorreorecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
