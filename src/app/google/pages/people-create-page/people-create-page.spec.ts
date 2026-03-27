import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleCreatePage } from './people-create-page';

describe('PeopleCreatePage', () => {
  let component: PeopleCreatePage;
  let fixture: ComponentFixture<PeopleCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleCreatePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
