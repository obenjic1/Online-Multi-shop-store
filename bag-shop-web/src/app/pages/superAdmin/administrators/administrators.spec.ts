import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Administrators } from './administrators';

describe('Administrators', () => {
  let component: Administrators;
  let fixture: ComponentFixture<Administrators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Administrators],
    }).compileComponents();

    fixture = TestBed.createComponent(Administrators);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
