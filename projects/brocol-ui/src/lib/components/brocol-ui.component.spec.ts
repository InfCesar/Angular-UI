import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrocolUiComponent } from './brocol-ui.component';

describe('BrocolUiComponent', () => {
  let component: BrocolUiComponent;
  let fixture: ComponentFixture<BrocolUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrocolUiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrocolUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
