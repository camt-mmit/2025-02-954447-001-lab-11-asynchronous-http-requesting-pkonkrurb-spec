import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFieldTree } from './event-field-tree';

describe('EventFieldTree', () => {
  let component: EventFieldTree;
  let fixture: ComponentFixture<EventFieldTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFieldTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFieldTree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
