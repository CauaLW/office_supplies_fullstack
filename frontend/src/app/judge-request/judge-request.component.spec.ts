import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeRequestComponent } from './judge-request.component';

describe('JudgeRequestComponent', () => {
  let component: JudgeRequestComponent;
  let fixture: ComponentFixture<JudgeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgeRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JudgeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
