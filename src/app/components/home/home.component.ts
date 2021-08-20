import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DateServiceService} from "../../services/date-service.service";
import {GloblDataSummary} from '../models/globldata'
import {GoogleChartInterface} from "ng2-google-charts";
//
// export interface GloblDataSummary{
//   country? : string,
//   confirmed? : number,
//   deaths?:number,
//   recovered?:number,
//   active?:number
// }
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  @ViewChild('mychart', {static:false}) inpRef:any=ElementRef
  @ViewChild('mychart2', {static:false}) inpRef2:any=ElementRef
  totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  globlData : any[]=[]
  pieChart:GoogleChartInterface={chartType:'Piechart'}
  columnChart:GoogleChartInterface={chartType:'ColumnChart'}
  constructor(private dataService:DateServiceService) { }

  initChart(caseType:any){
    let datalabel=[]
      datalabel.push(['Country','Cases'])
    console.log(this.globlData)
    this.globlData.forEach(cs=>{

      let value :number=0;
      if (caseType=='a')
      if (cs.confirmed && cs.confirmed>100000)
      value = cs.confirmed;
      if (caseType=='b')
      if (cs.active && cs.active>100000)
          value=cs.active
      if (caseType=='c')
        if (cs.deaths && cs.deaths>100000)
          value=cs.deaths
      if (caseType=='d')
        if (cs.recovered && cs.recovered>100000)
          value=cs.recovered


      datalabel.push([cs.country,value])

    })
    this.pieChart={
      chartType: 'PieChart',
      dataTable: datalabel,
      //firstRowIsData: true,
      options: {height:500,width:900},
    }
    console.log(this.pieChart, 'asdsadsad')

    this.columnChart={
      chartType: 'ColumnChart',
      dataTable: datalabel,
      //firstRowIsData: true,
      options: {height:500,width:900},
    }
    console.log('changed')

  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next : (res)=>{
        this.globlData=res
      res.forEach(cs=> {
        if(!Number.isNaN(cs.totalConfirmed)){
        this.totalActive += cs.active
        this.totalConfirmed += cs.confirmed
        this.totalDeaths += cs.deaths
        this.totalRecovered += cs.recovered
        }
      })
        this.initChart('b')
        console.log('mtav onInit')
      }
    })
  }

  ubdateChart(input: HTMLInputElement) {
   this.initChart(input.value)
    this.inpRef.draw();
    this.inpRef2.draw();

  }
}

