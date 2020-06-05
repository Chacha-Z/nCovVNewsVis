import React, {Component} from 'react';
import * as d3 from "d3";
import axios from 'axios';

class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        overallD:[],
        overallW:[],
        dayDetail: [],
        weekDetail: [],
        cases:[],
        isDay: 1
    };
  }

  componentDidMount(){
      //修改数据日期类型，使d3可识别
      var parseDate1 = d3.timeParse('%Y-%m-%d');
      var parseDate2 = d3.timeParse('%Y-%m-%d %H:%M:%S');

      var casetemp = this.createRandomCasesData('2020-01-01', '2020-05-17')
      casetemp.forEach(e => {
        e.date = parseDate1(e.date);
      })
      this.setState({cases: casetemp });
      var daytemp = this.createRandomDayDetail()
      daytemp.forEach(e => {
        e.date = parseDate2(e.date);
      });
      this.setState({dayDetail: daytemp});

      const _this=this;    //先存一下this，以防使用箭头函数this会指向我们不希望它所指向的对象。

      axios.all([axios.get('http://120.27.243.210:3000/getDay'), axios.get('http://120.27.243.210:3000/getWeek')])
      .then(axios.spread((res1, res2) => {
        let rawData1 = res1.data.results
        let rawData2 = res2.data.results

        rawData1.forEach(e => {
          e.date = parseDate1(e.date);
        })
        _this.setState({
          overallD: rawData1,
        });

        rawData2.forEach(e => {
          e.begin = parseDate1(e.begin);
        })
        _this.setState({
          overallW: rawData2,
        });

        _this.drawDayView()
      }))
      .catch(function (error) {
        console.log(error);
        _this.setState({
          isLoaded:false,
          error:error
        })
      })

  }

  render(){
      return (
          <>
          <svg id='main-view'></svg>
          <svg id="detail-view"></svg>
          </>
      );
  }

  drawDayView(){
    const date = ['date', 'begin']
    const data = [this.state.overallD, this.state.overallW]
    const hot = ['totalHot', 'TotalHot']

    console.log(date[this.state.isDay])
    console.log(data[this.state.isDay])
    //初始/默认数据：
    //时间轴：以天为单位，展示全部；
    //显示区域：默认以天为单位，选中最近20天；

    //数据：返回全部周/天合并B2，点击再请求当天或周展开具体，周-当周第一天日期

    var padding = this.state.isDay==0?3:10
    //长宽高常量设定
    var h2 = 25;
    var margin2 = {top:15, right:60, bottom:20, left:60}

    var margin = {top:h2+margin2.top+margin2.bottom, right:margin2.right, bottom:20, left:margin2.left};
    var w = 780 - margin.left - margin.right,
        h = 300 - margin.top - margin.bottom;

    //比例尺
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var x = d3.scaleTime().range([padding, w-padding]);
    var mainy = d3.scaleLinear().range([h-padding, padding]);
    var casesy = d3.scaleLinear().range([h, 0]);
    var x2 = d3.scaleTime().range([0, w]);
    var y2 = d3.scaleLinear().range([h2, 0]);

    // 定义SVG container
    var $plot = d3.select("#main-view")
                .attr("height", h + margin.top + margin.bottom)
                .attr("width", w + margin.left + margin.right)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var $timeline = d3.select("#main-view")
                    .append("g")
                    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    //坐标轴
    const xAxis = d3.axisTop()
                    .scale(x)
                    .tickFormat(d3.timeFormat('%d/%m'))
    const mainyAxis = d3.axisLeft()
                  .scale(mainy);
    const casesyAxis = d3.axisRight()
                  .scale(casesy);
    const xAxis2 = d3.axisBottom(x2)
                    .tickFormat(d3.timeFormat('%d/%m'))
    
    //生成器
    var brush = d3.brushX()
                  .extent([[0, 0], [w, h2]])
                  .on('brush', ()=>{
                    const selection = d3.event.selection;

                    var dateRange = selection.map(x2.invert, x2);
                    x.domain(dateRange);
                
                    area.x(d => x(d.date))
                        .y1(d => casesy(d.number))
                    line.x(d => x(d[date[this.state.isDay]]))
                        .y(d => mainy(d[hot[this.state.isDay]]))
                
                    $plot.selectAll('.backgroud')
                          .attr('d', area)
                    $plot.selectAll('.dashlink')
                        .attr('d', line)
                
                    $plot.selectAll('.mark')
                      .attr("transform", d => {
                        return `translate(${x(d[date[this.state.isDay]])}, ${mainy(d[hot[this.state.isDay]])})`;
                      })
                    
                    $plot.select('.axis.x').call(xAxis);
                  })
                  .on('end', ()=>{
                    const selection = d3.event.selection;
                    var dateRange = selection.map(x2.invert, x2);
                
                    // console.log(selection);
                    // console.log(selection.map(x2.invert, x2));
                    
                    //修改图标大小失败
                    // var days = Math.floor((dateRange[1].getTime() - dateRange[0].getTime())/(1000*60*60*24))
                    // symbol.size(d3.min([150, Math.pow(w/days, 2)]))
                    // $plot.selectAll('.markp')
                    //     .attr('d', symbol)
                
                    x.domain(dateRange);
                    $plot.select('.axis.x').call(xAxis);
                  });
    var symbolkeys = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle, d3.symbolStar, d3.symbolCross, d3.symbolWye];
    var symbolSize = this.state.isDay==0?60:200;
    var symbol = d3.symbol().type(d=>symbolkeys[d.classification]).size(symbolSize);
    var area = d3.area()
              .x(d => x(d.date))
              .y1(d => casesy(d.number))
              .curve(d3.curveMonotoneX);
    var line = d3.line()
                  .x(d => x(d[date[this.state.isDay]]))
                  .y(d => mainy(d[hot[this.state.isDay]]))
    var area2 = d3.area()
                .x(d => x2(d.date))
                .y1(d => y2(d.number))
                .curve(d3.curveMonotoneX);
    //详细视图初始化
    const padding3 = 5;
    var margin3 = {top:10, right:margin2.right, bottom:25, left:margin2.left}
    var h3 = 80;
    var x3 = d3.scaleTime().range([padding3, w-padding3]);
    var y3 = d3.scaleLinear().range([h3-padding3, padding3]);
    var xAxis3 = d3.axisBottom(x3);
    var $detail = d3.select("#detail-view")
                    .attr('width', w + margin3.left + margin3.right)
                    .attr('height', h3 + margin3.top + margin3.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
    var line3 = d3.line()
                  .x(d => x3(d.t))
                  .y(d => y3(d.hot))
    //比例尺值域设置
    color.domain([0, 6])
    x.domain([d3.min(data[this.state.isDay], d=>d[date[this.state.isDay]]), d3.max(data[this.state.isDay], d=>d[date[this.state.isDay]])])
    mainy.domain([d3.min(data[this.state.isDay], d=>d[hot[this.state.isDay]]), d3.max(data[this.state.isDay], d=>d[hot[this.state.isDay]])])
    casesy.domain([d3.min(this.state.cases, d=>d.number), d3.max(this.state.cases, d=>d.number)])

    //蒙版
    $plot.append('clipPath')
        .attr('id', 'mark-area')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', w)
        .attr('height', h)

    //区域生成器
    area.y0(casesy(d3.min(this.state.cases, d=>d.number)))
    var backgroud = $plot.append('g')
                      .attr('class', 'area')
                      .attr('clip-path', 'url(#mark-area)')
                      .append('path')
                      .datum(this.state.cases)
                      .attr('class', 'backgroud')
                      .attr('d', area)
                      .attr('fill', 'grey')
                      .attr('opacity', '0.15')

    //折线生成器
    var backgroud = $plot.append('g')
                      .attr('class', 'line')
                      .attr('clip-path', 'url(#mark-area)')
                      .append('path')
                      .datum(data[this.state.isDay])
                      .attr('class', 'dashlink')
                      .attr('d', line)
                      .attr('stroke', 'grey')
                      .attr('stroke-dasharray', '5,5')
                      .attr('fill', 'none')

    //形状生成器
    //绑定数据
    const marks = $plot.append('g')
                    .attr('class', 'marks')
                    .attr('clip-path', 'url(#mark-area)')
                    .selectAll('.mark')
                    .data(data[this.state.isDay])
                    .enter()
                    .append('g')
                    .attr('class', 'mark')
                    .append('path')
                    .attr('class', 'markP')
                    .attr('d', symbol)
                    .attr('fill', d=>color(d.classification))
                    .attr('opacity', '0.75')
    $plot.selectAll('.mark')
        .attr("transform", d => {
          return `translate(${x(d[date[this.state.isDay]])}, ${mainy(d[hot[this.state.isDay]])})`;
        })
        .on('click', (d)=>{this.getDetail(d[date[this.state.isDay]], $detail, x3, y3, h3, line3, xAxis3, color, symbol)})

    //坐标轴绘制
    $plot.append('g')
        .attr('class', 'axis x');
    $plot.append('g')
        .attr('class', 'axis mainy');
    $plot.append('g')
        .attr('class', 'axis casesy');

    $plot.select('.axis.x')
      .attr('transform', `translate(0, ${h+18})`)
      .call(xAxis);
    $plot.select('.axis.mainy')
      .attr('transform', 'translate(0, 0)')
      .call(mainyAxis);
    $plot.select('.axis.casesy')
      .attr('transform', `translate(${w}, 0)`)
      .call(casesyAxis);


    // timeline
    x2.domain(x.domain());
    y2.domain(casesy.domain());
    area2.y0(y2(d3.min(this.state.cases, d=>d.number)))
    $timeline.append('g')
            .attr('class', 'area2')
            .append('path')
            .datum(this.state.cases)
            .attr('class', 'backgroud2')
            .attr('d', area2)
            .attr('fill', 'grey')
            .attr('opacity', '0.15')
    $timeline.append('g')
        .attr('class', 'axis x2');
        
    $timeline.select('.axis.x2')
      .attr('transform', `translate(0, ${h2})`)
      .call(xAxis2);
    
    //刷选工具
    
    $timeline.append('g')
            .call(brush);
  
  }

  getDetail(date, $detail, x3, y3, h3, line3, xAxis3, color, symbol){
    if(this.state.isDay == 0){
      var dateFormat = d3.timeFormat('%Y-%m-%d')
      date = dateFormat(date)
      console.log(date)
      
      var parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
  
      var _this = this;

      axios.post(" http://120.27.243.210:3000/postDay",
      //参数列表
        {
          d: date
        },
      ).then((res)=>{
          var r = res.data.results
          r = r.filter(function(element){
            return element.classification != -1;
          })
          r.forEach(element => element.t = parseDate(element.t))
          console.log(r)
          _this.setState({
            dayDetail: r
          });
          
          _this.drawDetail($detail, x3, y3, h3, line3, xAxis3, color, symbol)
      })
    }else{
      axios.post(" http://120.27.243.210:3000/postWeek",
      //参数列表
        {
          week: 10
        },
      ).then((res)=>{
          var r = res.data.results
          console.log(r)
      })
    }

  }
  drawDetail($detail, x3, y3, h3, line3, xAxis3, color, symbol){
    
    $detail.selectAll('g').remove();
    // this.getData()

    //比例尺值域设置
    color.domain([0, 6])
    x3.domain([d3.min(this.state.dayDetail, d=>d.t), d3.max(this.state.dayDetail, d=>d.t)])
    y3.domain([d3.min(this.state.dayDetail, d=>d.hot), d3.max(this.state.dayDetail, d=>d.hot)])
    console.log(y3.domain())

    //绘图
    $detail.append('g')
        .attr('class', 'dline')
        .append('path')
        .datum(this.state.dayDetail)
        .attr('class', 'ddashlink')
        .attr('d', line3)
        .attr('stroke', 'grey')
        .attr('stroke-dasharray', '5,5')
        .attr('fill', 'none')
    const marks = $detail.append('g')
                    .attr('class', 'dmarks')
                    .selectAll('.dmark')
                    .data(this.state.dayDetail)
                    .enter()
                    .append('g')
                    .attr('class', 'dmark')
                    .append('path')
                    .attr('class', 'dmarkP')
                    .attr('d', symbol)
                    .attr('fill', d=>color(d.classification))
                    .attr('opacity', '0.75')
    $detail.selectAll('.dmark')
        .attr("transform", d => {
          return `translate(${x3(d.t)}, ${y3(d.hot)})`;
        })
    //坐标轴绘制
    $detail.append('g')
        .attr('class', 'axis x3');

    $detail.select('.axis.x3')
      .attr('transform', `translate(0, ${h3})`)
      .call(xAxis3);
  }
  
  //随机生成主视图数据
  createRandomoverallDData(start,end){
    var result = [];
    var beginDay = start.split("-");
    var endDay = end.split("-");
    var diffDay = new Date();
    var dateList = new Array;
    var i = 0;
    diffDay.setDate(beginDay[2]);
    diffDay.setMonth(beginDay[1]-1);
    diffDay.setFullYear(beginDay[0]);
    result.push({
        'date': start,
        'classification':  parseInt(Math.random() * 6),
        'totalHot': parseInt(Math.random() * 10)+1
    });
    while(i == 0){
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
        diffDay.setTime(countDay);
        dateList[2] = diffDay.getDate();
        dateList[1] = diffDay.getMonth() + 1;
        dateList[0] = diffDay.getFullYear();
        if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]};
        if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]};
        result.push({
            'date': dateList[0]+"-"+dateList[1]+"-"+dateList[2],
            'classification':  parseInt(Math.random() * 6),
            'totalHot': parseInt(Math.random() * 10)+1
        });
        if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){
          i = 1;
        }
    };
    //console.log(result);
    return result;
  };
  
  createRandomCasesData(start,end){
    var result = [];
    var beginDay = start.split("-");
    var endDay = end.split("-");
    var diffDay = new Date();
    var dateList = new Array;
    var i = 0;
    diffDay.setDate(beginDay[2]);
    diffDay.setMonth(beginDay[1]-1);
    diffDay.setFullYear(beginDay[0]);
    result.push({
        'date': start,
        'number':  parseInt(Math.random() * 3000),
    });
    while(i == 0){
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
        diffDay.setTime(countDay);
        dateList[2] = diffDay.getDate();
        dateList[1] = diffDay.getMonth() + 1;
        dateList[0] = diffDay.getFullYear();
        if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]};
        if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]};
        result.push({
            'date': dateList[0]+"-"+dateList[1]+"-"+dateList[2],
            'number':  parseInt(Math.random() * 3000),
        });
        if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){
          i = 1;
        }
    };
    //console.log(result);
    return result;
  };

  createRandomDayDetail(){
      return [
        {
            'date': '2019-01-02 7:02:00', 
            'classification': 0,
            'totalHot': 3,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 07:22:00', 
            'classification': 1,
            'totalHot': 8,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 09:24:00', 
            'classification': 3,
            'totalHot': 4,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 09:54:00', 
            'classification': 2,
            'totalHot': 6,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 10:24:00', 
            'classification': 1,
            'totalHot': 4,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 11:47:00', 
            'classification': 0,
            'totalHot': 9,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 12:12:00', 
            'classification': 1,
            'totalHot': 5,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 14:56:00', 
            'classification': 2,
            'totalHot': 4,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 15:09:00', 
            'classification': 4,
            'totalHot': 5,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 16:02:00', 
            'classification': 5,
            'totalHot': 8,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 17:24:00', 
            'classification': 3,
            'totalHot': 4,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 18:24:00', 
            'classification': 3,
            'totalHot': 0,
            'content': 'hhuhuh'
          },
          {
            'date': '2019-01-02 20:02:00', 
            'classification': 2,
            'totalHot': 3,
            'content': 'hhuhuh'
          },
      ]
  }
  
}

export default MainView;