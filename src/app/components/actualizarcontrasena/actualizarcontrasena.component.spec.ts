import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarcontrasenaComponent } from './actualizarcontrasena.component';

describe('ActualizarcontrasenaComponent', () => {
  let component: ActualizarcontrasenaComponent;
  let fixture: ComponentFixture<ActualizarcontrasenaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarcontrasenaComponent]
    });
    fixture = TestBed.createComponent(ActualizarcontrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
