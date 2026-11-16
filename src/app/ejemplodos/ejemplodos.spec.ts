import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ejemplodos } from './ejemplodos';

describe('Ejemplodos', () => {
  let component: Ejemplodos;
  let fixture: ComponentFixture<Ejemplodos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ejemplodos],
    }).compileComponents();

    fixture = TestBed.createComponent(Ejemplodos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
