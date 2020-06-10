import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatInputModule, MatNativeDateModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CollectionPage } from './collection/collection-page'
import { MoneyCounter } from './collection/money-counter/money-counter';
import { BackofficeComponent, DeleteCollectionConfirmDialog } from './backoffice/backoffice.component';
import { LoginPageComponent } from './backoffice/login.component';
import { CollectionTable } from './backoffice/collection-table'
import { ViewCollectionComponent } from './backoffice/view-collection';


const routes: Routes = [
  { path: '', component: CollectionPage },
  { path: 'backoffice', component: BackofficeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'collections/:id', component: ViewCollectionComponent}
];

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatGridListModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(routes)
  ],
  providers: [MatNativeDateModule],
  entryComponents: [DeleteCollectionConfirmDialog],
  declarations: [
    AppComponent,
    TopBarComponent,
    CollectionPage,
    MoneyCounter,
    LoginPageComponent,
    BackofficeComponent,
    DeleteCollectionConfirmDialog,
    ViewCollectionComponent,
    CollectionTable
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }