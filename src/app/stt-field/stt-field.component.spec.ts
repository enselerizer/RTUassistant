import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SttFieldComponent } from './stt-field.component';

describe('SttFieldComponent', () => {
  let component: SttFieldComponent;
  let fixture: ComponentFixture<SttFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SttFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SttFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
