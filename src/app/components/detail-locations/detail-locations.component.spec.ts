import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLocationsComponent } from './detail-locations.component';

describe('DetailLocationsComponent', () => {
  let component: DetailLocationsComponent;
  let fixture: ComponentFixture<DetailLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailLocationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
