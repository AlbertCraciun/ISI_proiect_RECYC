import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTestPageComponent } from './map-test-page.component';

describe('MapTestPageComponent', () => {
  let component: MapTestPageComponent;
  let fixture: ComponentFixture<MapTestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapTestPageComponent]
    });
    fixture = TestBed.createComponent(MapTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
