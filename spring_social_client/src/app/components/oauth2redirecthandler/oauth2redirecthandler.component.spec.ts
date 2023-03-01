import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oauth2redirecthandlerComponent } from './oauth2redirecthandler.component';

describe('Oauth2redirecthandlerComponent', () => {
  let component: Oauth2redirecthandlerComponent;
  let fixture: ComponentFixture<Oauth2redirecthandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Oauth2redirecthandlerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Oauth2redirecthandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
