import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DateServiceService} from '../../services/date-service.service'
import {GloblDataSummary} from "../models/globldata";
import {DataWiseData} from "../models/data-wise-data";
import {GoogleChartInterface} from "ng2-google-charts";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  @ViewChild('chart') child:any=ElementRef
data:GloblDataSummary[]=[]
  countries:string[]=[]
  totalConfirmed:any=0;
  totalActive:any=0;
  totalDeaths:any=0;
  totalRecovered:any=0;
  selectedCountryData:DataWiseData[]=[];
  dateWiseData:any;
  lineChart:GoogleChartInterface={chartType:'LineChart'};
  constructor(private service : DateServiceService) { }

  ngOnInit(): void {
    this.service.getDateWiceDataUrl().subscribe(res=> {
      this.dateWiseData = res
      this.updateChart()
    })
    this.service.getGlobalData().subscribe(result=>{
      this.data=result;
      this.data.forEach(cs=>{
       if (cs.country){ this.countries.push(cs.country)}
      })
    })
  }
updateChart(){
    let dataTable=[]
  dataTable.push(['Cases','Date'])
  this.selectedCountryData.forEach(cs=>{
    dataTable.push([cs.cases,cs.date])
  })
  this.lineChart={
      chartType:'LineChart',
    dataTable:dataTable,
    options:{height:500}
  }
  this.child.draw()
}
  updateValues(country: string) {
    this.data.forEach(cs=>{
      if (cs.country===country){
        this.totalActive=cs.active
        this.totalConfirmed=cs.confirmed
        this.totalDeaths=cs.deaths
        this.totalRecovered=cs.recovered
      }
    })
    this.selectedCountryData=this.dateWiseData[country]
    this.updateChart()
  }
}
