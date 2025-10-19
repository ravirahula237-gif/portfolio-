import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicBackgroundComponent } from './graphic-background.component';

describe('GraphicBackgroundComponent', () => {
  let component: GraphicBackgroundComponent;
  let fixture: ComponentFixture<GraphicBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphicBackgroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
