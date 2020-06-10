
export class ApiResponse{
    constructor(public success: boolean, public error: string){}
}
export class Envelope {
    id:number
    person:string
    amount:number

    constructor({id, person, amount}){
        this.id = id
        this.person = person
        this.amount = amount
    }
}

export enum Currency{
    EURO = 'EURO', OTHER = 'OTHER'   
}

export class Giving {
    person: string
    cause: string
    currency: Currency
    amountInEuroBills: number
    amountInEuroCoins: number
    amountInOtherCurrency: string

    constructor({person, cause, currency, amountInEuroBills, amountInEuroCoins, 
        amountInOtherCurrency}){
        this.person = person
        this.cause = cause
        this.currency = currency
        this.amountInEuroBills = amountInEuroBills
        this.amountInEuroCoins = amountInEuroCoins
        this.amountInOtherCurrency = amountInOtherCurrency
    }

    get inEuro(): boolean{
        return this.currency === Currency.EURO
    } 
    get amount(): string {
        if(this.inEuro)
            return `Bills: €${this.amountInEuroBills.toFixed(2)}; 
                    Coins: €${this.amountInEuroCoins.toFixed(2)}`
        else
            return this.amountInOtherCurrency
    }
}

export class Collection {
    id: number
    date: Date
    collector1: string
    collector2: string
    additionalDetails: string
    attendantCount: number
    givings: Giving[]

    constructor({id, date, collector1, collector2, additionalDetails, 
            attendantCount, givings}){
        this.id = id
        this.date = new Date(date)
        this.collector1 = collector1
        this.collector2 = collector2
        this.additionalDetails = additionalDetails
        this.attendantCount = attendantCount
        this.givings = givings ? givings.map((g:any) => new Giving(g)): []
    }

    getFormattedDate(): string {
        const mm = this.date.getMonth() + 1
        const dd = this.date.getDate()
        return [this.date.getFullYear(),
                (mm>9 ? '' : '0') + mm, 
                (dd>9 ? '' : '0') + dd
                ].join('-')
    }


    getCollectors():string {
        return `${this.collector1}, ${this.collector2}`
    }

    get totalsPerEuroCause(): any[] {
        const totals:Array<any> = [] 
        console.log('Will get totals')
        const euroGivings = this.givings.filter(g => g.currency === 'EURO')
        euroGivings.forEach(giving => {
            let existing:any = totals.find(t => t.cause === giving.cause)
            if(!existing){
                existing = {cause: giving.cause, bills: 0, coins: 0}
                totals.push(existing)
            }
            existing.bills += giving.amountInEuroBills
            existing.coins += giving.amountInEuroCoins
        })
         
        return totals
    }
}
