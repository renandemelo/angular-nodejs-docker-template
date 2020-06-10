import { Component, AfterViewInit, Input, ViewChild, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Collection } from '../domain/model'; 
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-table',
  templateUrl: './collection-table.html',
  styleUrls: ['./collection-table.scss']
})
export class CollectionTable implements OnChanges{ 

  @Input("collections") collections: Collection[]
  dataSource: MatTableDataSource<Collection> = new MatTableDataSource();
  @Output() deleteCollection: EventEmitter<Collection> = new EventEmitter();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator

  constructor(private router: Router){}

  displayedColumns: string[] = ['id','date', 'collectors', 'delete']

  ngOnChanges(changes: SimpleChanges): void {
    const {collections} = changes
    if(collections){
      this.dataSource = new MatTableDataSource(collections.currentValue)
      this.dataSource.paginator = this.paginator
    }
  }
  
  select(collection: Collection){
    console.log(`Selecting: ${collection}`)
    this.router.navigate([`/collections/${collection.id}`])
  }

  delete(collection: Collection){
    this.deleteCollection.emit(collection)
  }
}