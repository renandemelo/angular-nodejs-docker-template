import { Component, ViewChild, OnInit } from '@angular/core';
import { MoneyCounter } from '../collection/money-counter/money-counter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Giving, Currency, ApiResponse } from '../domain/model';
import { CollectionService } from '../domain/collection.service';

enum FinalStatus{
  SUCCESS, FAILURE
}

const defaultCauses: string[] = ['General fund', 'Benevolence', 'Moldova', 'Other']

@Component({
  selector: 'app-collection-page',
  templateUrl: './collection-page.html',
  styleUrls: ['./collection-page.scss']
})
export class CollectionPage implements OnInit
{
  displayedColumns: string[] = ['person', 'cause', 'amount', 'delete']
  causes: string[] = defaultCauses
  givings: Array<Giving> = []
  addingNew: boolean = false
  person: string
  selectedCause: string
  typedCause?: string
  inEuro: boolean
  someoneSpecific: boolean
  amountInOtherCurrency?: string
  finalDetailsGroup: FormGroup
  finalStatus?: FinalStatus = undefined
  apiError: string 
  submitted: boolean = false

  @ViewChild('moneyCounter', {static: false}) moneyCounter: MoneyCounter

  constructor(private _formBuilder: FormBuilder, private collectionService: CollectionService) {}

  ngOnInit() {
    this.finalDetailsGroup = this._formBuilder.group({
      offeringDate: [new Date()],
      collector1: [],
      collector2: [],
      attendantCount: [],
      password: [],
      additionalDetails: [] 
    })
  }

  startAddGiving(): void {
    this.addingNew = true;
    this.selectedCause = defaultCauses[0]
    this.someoneSpecific = false
    this.inEuro = true
    this.typedCause = undefined
    this.amountInOtherCurrency = undefined
  }
  get otherCause(): boolean {
    return this.selectedCause === 'Other'
  }
  private isStatus(status? : FinalStatus): boolean {
    return this.submitted && this.finalStatus === status
  }
  get success(): boolean {
    return this.isStatus(FinalStatus.SUCCESS)
  }

  get failure(): boolean {
    return this.isStatus(FinalStatus.FAILURE)
  }

  get sending(): boolean {
    return this.isStatus(undefined)
  }

  get totalOfEuro(){
    const total = this.givings.filter(g => g.inEuro)
        .reduce((t, g) => t + g.amountInEuroBills + g.amountInEuroCoins
        , 0);
    return total.toFixed(2);
  }

  onSubmit(e): void {
    e.preventDefault();
    if(this.success || !this.finalDetailsGroup.valid)
      return
    const dataToSubmit = {
                  'givings': this.givings,
                  'date': this.finalDetailsGroup.get('offeringDate')!.value,
                  'collector1': this.finalDetailsGroup.get('collector1')!.value, 
                  'collector2': this.finalDetailsGroup.get('collector2')!.value, 
                  'attendantCount': this.finalDetailsGroup.get('attendantCount')!.value,
                  'password': this.finalDetailsGroup.get('password')!.value,
                  'additionalDetails': this.finalDetailsGroup.get('additionalDetails')!.value}
    
    console.log('Will submit: ' + JSON.stringify(dataToSubmit))
    this.submitted = true
    this.collectionService.collect(dataToSubmit)
      .subscribe((apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.finalStatus = FinalStatus.SUCCESS
        } else{ 
          this.finalStatus = FinalStatus.FAILURE
          this.apiError = apiResponse.error
        }
      }, (error) => {
        this.finalStatus = FinalStatus.FAILURE
        this.apiError = `Error: ${error.message} - returned status: ${error.status} - details: ${error.error}`
      })
  }

  onDelete(giving): void {
    this.givings = this.givings.filter((g) => g !== giving);
  }

  onCancel(): void {
    this.addingNew = false
  }

  onAdd():void {
    const giving = new Giving({person: this.someoneSpecific ? this.person: null, 
              cause: this.otherCause? this.typedCause : this.selectedCause, 
              currency: this.inEuro? Currency.EURO: Currency.OTHER, 
              amountInEuroBills: this.inEuro? this.moneyCounter.totalBills : null, 
              amountInEuroCoins: this.inEuro? this.moneyCounter.totalCoins : null, 
              amountInOtherCurrency: !this.inEuro? this.amountInOtherCurrency :  null})
    console.log(giving)
    this.givings.push(giving)
    this.addingNew = false
    if(this.otherCause){
       //adds new cause just before "Other"
      this.causes.splice(this.causes.length - 1, 0, this.typedCause!)
    }
  }
}