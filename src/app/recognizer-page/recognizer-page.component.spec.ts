import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognizerPageComponent } from './recognizer-page.component';

describe('RecognizerPageComponent', () => {
  let component: RecognizerPageComponent;
  let fixture: ComponentFixture<RecognizerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecognizerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognizerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
