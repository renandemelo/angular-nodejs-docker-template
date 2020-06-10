import { Component, AfterViewInit, Inject } from '@angular/core';
import { LoginService} from '../domain/login.service'
import { Router } from '@angular/router';
import { Collection, ApiResponse } from '../domain/model';
import { CollectionService } from '../domain/collection.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


const COLLECTIONS_URL_CSV = "/api/collections.csv"

@Component({
  selector: 'app-backoffice',
  template: `
    <mat-spinner *ngIf="checkingLoginState" [diameter]='30' style="margin-left: 4px;"></mat-spinner>
    <div *ngIf="!checkingLoginState">
      <h2 class="title">Backoffice</h2>
      <app-collection-table [collections]="this.collections"
          (deleteCollection)="delete($event)">
      </app-collection-table>
      <a mat-raised-button [href]="csvUrl">
        <mat-icon>cloud_download</mat-icon>
        <span class="button_description">Download as CSV</span>
      </a>
    </div>
  `,
  styles:[
    `
    .title{
      margin-left: 24px;
    }
    .button_description{
      margin-left: 8px;
    }
    `
  ]
  
})
export class BackofficeComponent implements AfterViewInit { 

  checkingLoginState: boolean = true
  collections: Collection[] = []
  csvUrl = COLLECTIONS_URL_CSV

  constructor(private loginService: LoginService, 
              private collectionService: CollectionService, 
              private router: Router,
              public dialog: MatDialog ){ }

  ngAfterViewInit(): void {
    this.loginService.isLogged().subscribe((logged:boolean) => {
      if(logged){
        this.checkingLoginState = false
        this.getCollections()
      } else {
        this.router.navigate(['/login'])
      }
    })
  }

  getCollections(){
    this.collectionService.getAll().subscribe((collections: Collection[]) => {
      this.collections = collections
    })
  }

  delete(collection: Collection): void {
    console.log(`Collection id: ${collection.id}`)

    const dialogRef = this.dialog.open(DeleteCollectionConfirmDialog, {
      width: '250px',
      data: {collection: collection}
    })

    dialogRef.afterClosed().subscribe((data: any) => {
      if(data){
        this.collectionService.delete(data.collection).subscribe((apiResponse: ApiResponse) => {
          if(apiResponse.success){
            this.getCollections()
          }else{
            console.error(apiResponse.error)
          }
        })
      }
    })

  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <div mat-dialog-content>
    <p>Are you sure you want to remove this collection?</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Ok</button>
  </div>
  `
})
export class DeleteCollectionConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteCollectionConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Collection) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
