import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AngularMaterialSharedModule } from 'angular-material-shared';
import { RouterModule } from '@angular/router';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [AngularMaterialSharedModule, RouterModule.forRoot([]),],
      providers: [{
        provide: 'TINYMCE_BASE_URL',
        useValue: '/assets/tinymce-assets'
      }],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1.title').textContent).toContain('Dangl Material Shared Library');
  }));
});
