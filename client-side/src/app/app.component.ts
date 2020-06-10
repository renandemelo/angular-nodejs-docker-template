import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: 
    `
    <app-top-bar></app-top-bar>
    <div>
      <router-outlet></router-outlet>
    </div>
    `
})
export class AppComponent  {}