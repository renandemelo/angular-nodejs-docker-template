import { Component, ViewChild, Output, EventEmitter} from '@angular/core';


const bills = [5, 10, 20, 50, 100, 200, 500]
const coins = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01]

class MoneyInputData{
  moneyValue: number
  amount: number

  constructor(moneyValue: number){
    this.moneyValue = moneyValue
    this.amount = 0
  }

  get description():string {
    return this.moneyValue >= 1 ?
      `€${this.moneyValue}` : `${this.moneyValue*100}ct`
  }
}

@Component({
  selector: 'app-money-input',
  templateUrl: './money-counter.html',
  styleUrls: ['./money-counter.scss']
})
export class MoneyCounter {
  
  billsInputMap: Array<MoneyInputData>
  coinsInputMap: Array<MoneyInputData>
  possibleValues = Array.from(Array(50).keys()) // 0, 1, 2 ... 50

  constructor(){
    this.billsInputMap = bills.map((n) => new MoneyInputData(n))
    this.coinsInputMap = coins.map((n) => new MoneyInputData(n))
  }

  get totalCoins(): number{
    let totals: Array<number> = this.coinsInputMap.map((d) => d.amount * d.moneyValue)
    let sum: number = totals.reduce((total, current) => total + current)
    return parseFloat(sum.toFixed(2))
  }

  get totalBills(): number{
    let totals: Array<number> = this.billsInputMap.map((d) => d.amount * d.moneyValue)
    let sum: number = totals.reduce((total, current) => total + current)
    return parseFloat(sum.toFixed(2))
  }

  onAmountChange(billInputData: MoneyInputData, event: any): void{
    let typedAmount = parseFloat(event.value)
    const newAmount = isNaN(typedAmount)? 0 : typedAmount
    billInputData.amount = newAmount
  }


  reset(): void {
    this.billsInputMap.forEach(function(moneyDef) {
      moneyDef.amount = 0
    });
    this.coinsInputMap.forEach(function(moneyDef) {
      moneyDef.amount = 0
    });
  }
}