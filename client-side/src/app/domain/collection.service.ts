import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {catchError, flatMap} from 'rxjs/operators';
import { Collection, ApiResponse } from './model';


const COLLECTIONS_URL : string = "/api/collections"

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http: HttpClient) { }

  collect(params: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(COLLECTIONS_URL, params)
  }

  delete(collection: Collection): Observable<ApiResponse>{
    console.log(`Deleting ${collection.id}`)
    return this.http.delete<ApiResponse>(`${COLLECTIONS_URL}/${collection.id}`)
  }

  getCollection(id: number): Observable<Collection>{
    console.log(`Will call get at ${id}`)
    return this.http.get<any>(`${COLLECTIONS_URL}/${id}`).pipe(
      flatMap((result:any) => of(new Collection(result)))
    )
  }

  getAll(): Observable<Collection[]> {
    return this.http.get<any[]>(COLLECTIONS_URL).pipe(
      flatMap((result:any[]) => {
        const collections: Collection[] = result.map((c) => new Collection(c))
        return of(collections)
      })
    )
  }
}
