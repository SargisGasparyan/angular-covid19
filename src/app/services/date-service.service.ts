import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from 'rxjs/operators'
import {DataWiseData} from "../components/models/data-wise-data";

@Injectable({
  providedIn: 'root'
})
export class DateServiceService {
  private globalDataUrl='https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-31-2020.csv'
  private dateWiseDataUrl='https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  constructor(private http:HttpClient) {
  }

  getDateWiceDataUrl(){
    return this.http.get(this.dateWiseDataUrl,{responseType:'text'}).pipe(map(result =>{
      let rows = result.split('\n')
      console.log('rows is',rows)
      let mainData:any = {}
      let header=rows[0]
      let dates = header.split(/,(?=\S)/)
      dates.splice(0,4)
      rows.splice(0,1)
      rows.forEach(row=>{
        let cols = row.split(/,(?=\S)/)
        let con = cols[1]
        cols.splice(0,4)
        mainData[con]=[]
        cols.forEach((value,index)=>{
          let dw:DataWiseData={
            cases:+value,
            country:con,
            date:new Date(Date.parse(dates[index]))
          }
          mainData[con].push(dw)
        })
      })
      return mainData
    }))
  }
  getGlobalData(){
    return this.http.get(this.globalDataUrl,{responseType:'text'}).pipe(
      map(result=>{
        // let data:GlobalDataSummary[]=[]
        let raw:any={}
        let ard = result.split('\n')
        const rows = ard.slice(0, -2);

        rows.splice(0,1)
        rows.forEach(item=> {
          let cols=item.split(/,(?=\S)/)
          let cs={
            country:cols[3],
            confirmed:+cols[7],
            deaths:+cols[8],
            recovered:+cols[9],
            active:+cols[10],
          }
          let temp:any=raw[cs.country]
          if (temp){
            temp.active=cs.active + temp.active
            temp.confirmed=cs.confirmed + temp.confirmed
            temp.deaths=cs.deaths + temp.deaths
            temp.recovered=cs.recovered + temp.recovered
            raw[cs.country]=temp
          }else{
            raw[cs.country]=cs
          }
        })
       return <any[]>Object.values(raw)
      })
    )
  }
}
