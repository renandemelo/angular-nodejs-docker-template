import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { CollectionService } from '../domain/collection.service'
import { flatMap, switchMap, map } from 'rxjs/operators';
import { Collection } from '../domain/model';

@Component({
  selector: 'app-view-collection',
  styleUrls: ["./view-collection.scss"],
  templateUrl: './view-collection.html'
})
export class ViewCollectionComponent implements OnInit {

  collection: Collection

  constructor(private collectionService: CollectionService, 
    private route: ActivatedRoute){
  }

  doPrint(){
    window.print();
  }
  
  ngOnInit() {
    console.log(`Param map: ${this.route.paramMap}`)
    this.route.paramMap.pipe(
      map(params => {return params.get('id')!}),
      switchMap(id => this.collectionService.getCollection(parseInt(id)))
    ).subscribe(collection => {
        console.log(`collection!!! ${collection}`)
        this.collection = collection
    })
  }
}