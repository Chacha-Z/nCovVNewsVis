import React, {Component} from 'react';
import * as d3 from "d3";
import axios from 'axios';
import TopBar from '../TopBar/TopBar';
import { Switch } from 'antd';
import './MainView.css';
import EventBus from '../../utils/EventBus'

class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        overallD:[],
        overallW:[],
        dayDetail: [],
        weekDetail: [],
        cases:[],
        isDay: 1,
        isChina: 1,
        onFocusDay: '',
        onFocusWeek: -1,
        onFocusWeibo: -1
    };
    this.switchDay = this.switchDay.bind(this);
    this.switchCountry = this.switchCountry.bind(this);
    this.drawDetail = this.drawDetail.bind(this);
    
  }

  componentDidMount(){
      //修改数据日期类型，使d3可识别
      var parseDate1 = d3.timeParse('%Y-%m-%d');
      // var parseDate2 = d3.timeParse('%Y-%m-%d %H:%M:%S');

      const _this=this;    //先存一下this，以防使用箭头函数this会指向我们不希望它所指向的对象。

      axios.all([axios.get('http://120.27.243.210:3000/getDay'), axios.get('http://120.27.243.210:3000/getWeek'), axios.get('http://120.27.243.210:3000/getCov')])
      .then(axios.spread((res1, res2, res3) => {
        let rawData1 = res1.data.results
        let rawData2 = res2.data.results
        let rawData3 = res3.data.results

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
        
        rawData3.forEach(e => {
          e.date = parseDate1(e.date);
        })
        _this.setState({
          cases: rawData3,
        });
        _this.drawMainView()
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
          <div className='container'>
            <TopBar>
                <span id='top-title'>主视图</span>
                <Switch style={{float: 'right', marginRight: '10px',  marginTop: '3px'}} 
                  size="small"  checkedChildren="中国疫情背景" unCheckedChildren="海外疫情背景" defaultChecked onChange={this.switchCountry}/>
                <Switch style={{float: 'right', marginRight: '10px',  marginTop: '3px'}} 
                  size="small"  checkedChildren="天视图" unCheckedChildren="周视图" defaultChecked onChange={this.switchDay}/>
            </TopBar>
            <svg id='main-view'></svg>
            <div className='plottooltip' style={{opacity: '0'}}></div>
            <svg id="detail-view"></svg>
            <div className='detailtooltip' style={{opacity: '0'}}></div>
          </div>
      );
  }

  switchDay(checked){          
    let tempisday = checked?1:0
    this.setState({'isDay': tempisday}, function(){
      this.drawMainView()
    })
  }
  switchCountry(checked){
    let tempischina = checked?1:0
    this.setState({'isChina': tempischina}, function(){
      this.drawMainView()
    })
  }

  drawMainView(){
    const date = ['begin', 'date']
    const data = [this.state.overallW, this.state.overallD]
    const date2 = ['week', 'date']
    const stateFocus = [this.state.onFocusWeek, this.state.onFocusDay]
    const hot = ['TotalHot', 'totalHot']
    const number = ['world', 'china']
    console.log(this.state.overallW, this.state.overallD, this.state.cases)

    const lengendkeys = [
      {
        classification: 0,
        text: '疫情情况',
      },
      {
        classification: 1,
        text: '药品研究',
      },
      {
        classification: 2,
        text: '复工开学',
      },
      {
        classification: 3,
        text: '社会人文',
      },
      {
        classification: 4,
        text: '政府作为',
      },
      {
        classification: 5,
        text: '国外疫况',
      }
    ];

    var obj = document.getElementById("mainview");
    console.log(obj.clientWidth + "," + obj.clientHeight);

    //初始/默认数据：
    //时间轴：以天为单位，展示全部；
    //显示区域：默认以天为单位，选中最近20天；

    //数据：返回全部周/天合并B2，点击再请求当天或周展开具体，周-当周第一天日期

    var padding = this.state.isDay?5:10
    //长宽高常量设定
    var h2 = obj.clientHeight*0.05;
    var margin2 = {top:15, right:130, bottom:20, left:40}

    var margin = {top:h2+margin2.top+margin2.bottom, right:margin2.right, bottom:30, left:margin2.left};
    var w = obj.clientWidth  - margin.left - margin.right,
        h = obj.clientHeight*0.6 - margin.top - margin.bottom;
    console.log(w)

    //比例尺
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var x = d3.scaleTime().range([padding, w-padding]);
    var mainy = d3.scaleLinear().range([h-padding, padding]);
    var casesy = d3.scaleLinear().range([h-padding, padding]);
    var x2 = d3.scaleTime().range([0, w]);
    var mainy2 = d3.scaleLinear().range([h2, 0]);
    var casesy2 = d3.scaleLinear().range([h2, 0]);
    d3.select("#main-view").selectAll('g').remove()

    // 定义SVG container
    var $plot = d3.select("#main-view")
                .attr("height", h + margin.top + margin.bottom)
                .attr("width", w + margin.left + margin.right)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var $timeline = d3.select("#main-view")
                    .append("g")
                    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    const $tooltip = d3.select('.plottooltip');
    
    //坐标轴
    const xAxis = d3.axisTop()
                    .scale(x)
                    .tickFormat(d3.timeFormat('%d/%m'))
    const mainyAxis = d3.axisLeft()
                  .scale(mainy);
    const casesyAxis = d3.axisRight()
                  .scale(casesy)
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
                        .y1(d => casesy(d[number[this.state.isChina]]))
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
                    console.log(selection)
                    if(selection == null){
                      return ;
                    }
                    var dateRange = selection.map(x2.invert, x2);
                    var dateFormat =d3.timeFormat("%Y-%m-%d"); 

                    let begin = dateFormat(dateRange[0]);
                    let end = dateFormat(dateRange[1]);
                    
                    //修改图标大小失败
                    // var days = Math.floor((dateRange[1].getTime() - dateRange[0].getTime())/(1000*60*60*24))
                    // symbol.size(d3.min([150, Math.pow(w/days, 2)]))
                    // $plot.selectAll('.markp')
                    //     .attr('d', symbol)
                
                    x.domain(dateRange);
                    $plot.select('.axis.x').call(xAxis);

                    EventBus.emit('time-brush', [begin, end]);
                  });
    var symbolkeys = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle, d3.symbolStar, d3.symbolCross, d3.symbolWye];
    var symbolSize = this.state.isDay?80:200;
    var symbol = d3.symbol().type(d=>symbolkeys[d.classification]).size(symbolSize);
    var area = d3.area()
              .x(d => x(d.date))
              .y1(d => casesy(d[number[this.state.isChina]]))
              .curve(d3.curveMonotoneX);
    var line = d3.line()
                  .x(d => x(d[date[this.state.isDay]]))
                  .y(d => mainy(d[hot[this.state.isDay]]))
    var area2 = d3.area()
                .x(d => x2(d.date))
                .y1(d => casesy2(d[number[this.state.isChina]]))
                .curve(d3.curveMonotoneX);
    var line2 = d3.line()
                  .x(d => x2(d[date[this.state.isDay]]))
                  .y(d => mainy2(d[hot[this.state.isDay]]))
    //详细视图初始化
    const padding3 = 8;
    var margin3 = {top:10, right:margin2.right, bottom:30, left:margin2.left}
    var h3 = obj.clientHeight*0.18;
    var x3 = d3.scaleTime().range([padding3, w-padding3]);
    var y3 = d3.scaleLinear().range([h3-padding3, padding3+10]);
    var xAxis3 = d3.axisBottom(x3).tickFormat(d3.timeFormat('%H:%M'));
    if(d3.select("#detail-view").selectAll('g').empty()){
      var $detail = d3.select("#detail-view")
                      .attr('width', w + margin3.left + margin3.right)
                      .attr('height', h3 + margin3.top + margin3.bottom)
                      .append("g")
                      .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
    }else{
      var $detail = d3.select("#detail-view").select('g')
    }
    var line3 = d3.line()
                  .x(d => x3(d.t))
                  .y(d => y3(d.hot))


    //比例尺值域设置
    color.domain([0, 6])
    x.domain([d3.min(data[this.state.isDay], d=>d[date[this.state.isDay]]), d3.max(data[this.state.isDay], d=>d[date[this.state.isDay]])])
    mainy.domain([d3.min(data[this.state.isDay], d=>d[hot[this.state.isDay]]), d3.max(data[this.state.isDay], d=>d[hot[this.state.isDay]])])
    casesy.domain([d3.min(this.state.cases, d=>d[number[this.state.isChina]]), d3.max(this.state.cases, d=>d[number[this.state.isChina]])])

    //蒙版
    $plot.append('clipPath')
        .attr('id', 'mark-area')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', w)
        .attr('height', h)

    //timeline蒙版
    $plot.append('clipPath')
        .attr('id', 'timeline-area')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', w)
        .attr('height', h2)

    //区域生成器
    area.y0(casesy(d3.min(this.state.cases, d=>d[number[this.state.isChina]])))
    $plot.append('g')
          .attr('class', 'area')
          .attr('clip-path', 'url(#mark-area)')
          .append('path')
          .datum(this.state.cases)
          .attr('class', 'backgroud')
          .attr('d', area)
          .attr('fill', 'grey')
          .attr('opacity', '0.15')

    //折线生成器
    $plot.append('g')
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
    $plot.append('g')
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
          .attr('opacity', d=>d[date2[this.state.isDay]]-stateFocus[this.state.isDay]==0?'1': '0.55')

    console.log('this:' , this)

    $plot.selectAll('.mark')
        .attr("transform", d => {
          return `translate(${x(d[date[this.state.isDay]])}, ${mainy(d[hot[this.state.isDay]])})`;
        })
        .on('mouseover', function(d){

          d3.select(this).selectAll('.markP')
              .style('cursor', 'pointer')
              .classed('mouseon', true)

          //鼠标悬浮框
          $tooltip.transition()
                  .duration(100)
                  .style('opacity', .7)
          let container = $plot.node()
          let coordinates = d3.mouse(container);

          // console.log(coordinates)
          $tooltip.html(d3.timeFormat('%Y-%m-%d')(d.date) + '<br/>' + lengendkeys[d.classification].text)
              .style('left', (coordinates[0])+'px')
              .style('top', (coordinates[1])+'px')

        })
        .on("mouseout", function(d) {	
            d3.select(this).selectAll('.markP')
                .classed('mouseon', false)
        
            $tooltip.transition()		
                    .duration(200)		
                    .style("opacity", 0);	
        })
        .on('click', (d)=>{
          // d3.select(this).selectAll('.markP')
          //     .classed('onfocus', true)

          this.setState({onFocusDay: d[date[this.state.isDay]], onFocusWeek: d.week}, ()=>{
            let statek = [this.state.onFocusWeek, this.state.onFocusDay]
            $plot.selectAll('.markP')
              .attr('opacity', d=>d[date2[this.state.isDay]]-statek[this.state.isDay]==0?'1': '0.55')
          })
          this.getDetail(d, $detail, w, x3, y3, h3, line3, xAxis3, color, symbol)
        })

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
    casesy2.domain(casesy.domain());
    mainy2.domain(mainy.domain());
    area2.y0(casesy2(d3.min(this.state.cases, d=>d[number[this.state.isChina]])))
    $timeline.append('g')
            .attr('class', 'area2')
            .attr('clip-path', 'url(#timeline-area)')
            .append('path')
            .datum(this.state.cases)
            .attr('class', 'backgroud2')
            .attr('d', area2)
            .attr('fill', 'grey')
            .attr('opacity', '0.15')
    $timeline.append('g')
      .attr('class', 'line2')
      .append('path')
      .datum(data[this.state.isDay])
      .attr('class', 'dashlink2')
      .attr('d', line2)
      .attr('stroke', 'grey')
      .attr('stroke-dasharray', '5,5')
      .attr('fill', 'none')

    $timeline.append('g')
        .attr('class', 'axis x2');
    $timeline.select('.axis.x2')
      .attr('transform', `translate(0, ${h2})`)
      .call(xAxis2);
    
    //刷选工具
    $timeline.append('g')
            .call(brush);
  

    //图标说明
    this.drawLegend(lengendkeys, $plot, symbol, color, w, margin)
  }

  drawLegend(lengendkeys, $plot, symbol, color, w, margin){
    symbol.size(80)
    //添加颜色标签
    const legend = $plot.append('g')
            .attr('class', 'plot-legend')
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr('text-anchor', 'end')
            .selectAll("g")
            .data(lengendkeys)
            .enter().append("g")
            .attr("transform", (d, i) => `translate(${w+margin.left+20}, ${i*25+20})`);
    legend.append('path')
            .attr('d', symbol)
            .attr('opacity', .7)
            .attr('fill', (d, i) => color(i))
            .attr('rx', 2);
    legend.append('text')
            .attr('x', 10)
            .attr('dx', '0.325em')
            .attr('y', 10)
            .attr('dy', '-0.65em')
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'baseline')
            .text(d => d.text)
  }

  getDetail(d, $detail, w, x3, y3, h3, line3, xAxis3, color, symbol){
    var parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var _this = this;
    var tempWeek = d.week
    var tempDate = d[['begin', 'date'][this.state.isDay]]
    if(tempWeek < 10){
      tempWeek = '0'+ tempWeek
    }

    axios.post(" http://120.27.243.210:3000/postWeek",
    //参数列表
      {
        week: tempWeek
      },
    ).then((res)=>{
        var r = res.data.results
        r.forEach(e => {
          e.t = parseDate(e.t)
        })
        _this.setState({
          dayDetail: r,
        });
        console.log(r)
        _this.drawWeek($detail, d.day, tempDate, w, h3, x3, y3, line3, xAxis3, color, symbol)
    })

  }
  drawWeek($detail, day, date, w, h3, x3, y3, line3, xAxis3, color, symbol){

    const date2 = ['week', 'date']

    var dateFormat =d3.timeFormat("%Y-%m-%d"); 
    var tempDate = dateFormat(date)
    if(day == undefined){
      day = 1;
    }
    if(day==0) day=7;

    $detail.selectAll('g').remove();
    // 周导航
    const keys = [
      {
        key: 1,
        value: '周一',
        data: this.state.dayDetail.filter(e => e.day == 1),
        date: (d3.timeDay.offset(date, 1-day))
      }, 
      {
        key: 2,
        value: '周二',
        data: this.state.dayDetail.filter(e => e.day == 2),
        date: (d3.timeDay.offset(date, 2-day))
      }, 
      {
        key: 3,
        value: '周三',
        data: this.state.dayDetail.filter(e => e.day == 3),
        date: (d3.timeDay.offset(date, 3-day))
      }, 
      {
        key: 4,
        value: '周四',
        data: this.state.dayDetail.filter(e => e.day == 4),
        date: (d3.timeDay.offset(date, 4-day))
      }, 
      {
        key: 5,
        value: '周五',
        data: this.state.dayDetail.filter(e => e.day == 5),
        date: (d3.timeDay.offset(date, 5-day))
      }, 
      {
        key: 6,
        value: '周六',
        data: this.state.dayDetail.filter(e => e.day == 6),
        date: (d3.timeDay.offset(date, 6-day))
      }, 
      {
        key: 7,
        value: '周日',
        data: this.state.dayDetail.filter(e => e.day == 0),
        date: (d3.timeDay.offset(date, 7-day))
      }, 
    ]
    console.log(keys)
    const $context = $detail.append('g').attr('class', 'detail-context')
    const $week = $detail.append('g').attr('class', 'detail-bar')
                        .selectAll('week')
                        .data(keys)
                        .enter()
                        .append('g')
                        .attr('class', 'week')
    const $outer = $detail.append('g').attr('class', 'detail-outer')
    $week.append('rect')
          .attr('x', (d, i) => i*(w/7))
          .attr('y', -9)
          .attr('width', d => d.key==day?0:w/7)
          .attr('height', 18)
          .attr('fill', 'white')
          .attr('stroke', 'grey')
          .on('mouseover', function(d){
              d3.select(this)
                  .style('cursor', 'pointer')
          })
          .on('click', e => {
            $week.selectAll('rect')
                .attr('width', d => d.key==e.key?0:w/7)
            $outer.select('.day-text')
                .text(dateFormat(e.date))

            //透明度反馈
            this.setState({onFocusDay: e.date}, ()=>{
              let stateK = [this.state.onFocusWeek, this.state.onFocusDay]
              d3.selectAll('.markP')
                .attr('opacity', d => d[date2[this.state.isDay]]-stateK[this.state.isDay]==0?'1': '0.55')
            })

            this.drawDetail($context, e.data, x3, y3, h3, line3, xAxis3, color, symbol)
          })
    $week.append('text')
          .attr('class', 'week-text')
          .attr('x', (d, i) => i*(w/7)+(w/14))
          .attr('y', 5)
          .attr('fill', 'black')
          .text(d => d.value)
          .style('text-anchor', 'middle')
          .style('font-size', '12')
          .style('fill', 'grey')
          .on('mouseover', function(d){
              d3.select(this)
                  .style('cursor', 'pointer')
          })
          .on('click', e => {
            $week.selectAll('rect')
                .attr('width', d => d.key==e.key?0:w/7)
            $outer.select('.day-text')
                .text(dateFormat(e.date))

            //透明度反馈
            this.setState({onFocusDay: e.date}, ()=>{
              let stateK = [this.state.onFocusWeek, this.state.onFocusDay]
              d3.selectAll('.markP')
                .attr('opacity', d => d[date2[this.state.isDay]]-stateK[this.state.isDay]==0?'1': '0.55')
            })

            this.drawDetail($context, e.data, x3, y3, h3, line3, xAxis3, color, symbol)
          })
    $outer.append('rect')
          .attr('x', 0)
          .attr('y', -9)
          .attr('width', w)
          .attr('height', h3+35)
          .attr('fill', 'none')
          .attr('stroke', 'grey')
    $outer.append('text')
          .attr('class', 'day-text')
          .attr('x', -30)
          .attr('y', -10)
          .attr('fill', 'black')
          .text(tempDate)
          .style('text-anchor', 'middle')
          .style('font-size', '12')
          .style('fill', 'grey')
          .attr('transform', "rotate(270)")
          
    this.drawDetail($context, keys[day-1].data, x3, y3, h3, line3, xAxis3, color, symbol)
  }
  drawDetail($context, weekdata, x3, y3, h3, line3, xAxis3, color, symbol){
    $context.selectAll('g').remove();
    symbol.size(60)
    // this.getData()

    const $detailtooltip = d3.select('.detailtooltip');
    const $container = d3.select('.container');
    //比例尺值域设置
    x3.domain([d3.min(weekdata, d=>d.t), d3.max(weekdata, d=>d.t)])
    y3.domain([d3.min(weekdata, d=>d.hot), d3.max(weekdata, d=>d.hot)])
    console.log(y3.domain())

    //绘图
    $context.append('g')
        .attr('class', 'dline')
        .append('path')
        .datum(weekdata)
        .attr('class', 'ddashlink')
        .attr('d', line3)
        .attr('stroke', 'grey')
        .attr('stroke-dasharray', '5,5')
        .attr('fill', 'none')
    const marks = $context.append('g')
                    .attr('class', 'dmarks')
                    .selectAll('.dmark')
                    .data(weekdata)
                    .enter()
                    .append('g')
                    .attr('class', 'dmark')
                    .append('path')
                    .attr('class', 'dmarkP')
                    .attr('d', symbol)
                    .attr('fill', d=>color(d.classification))
                    .attr('opacity', '0.65')
                    .on('mouseover', function(d){
                        d3.select(this)
                            .style('cursor', 'pointer')
                            .classed('mouseon', true)

                        //鼠标悬浮框
                        $detailtooltip.transition()
                                .duration(100)
                                .style('opacity', .7)
                        let container = $container.node()
                        console.log(container)
                        let coordinates = d3.mouse(container);
              
                        // console.log(coordinates)
                        $detailtooltip.html(d3.timeFormat('%H:%M:%S')(d.t) + '<br/>' + d.content)
                            .style('left', (coordinates[0]+10)+'px')
                            .style('top', (coordinates[1]-30)+'px')
                    })
                    .on('mouseout', function(d){
                        d3.select(this)
                            .classed('mouseon', false)
                            
                        $detailtooltip.transition()		
                              .duration(200)		
                              .style("opacity", 0);	
                    })
                    .on('click', d=>{
                      
                      this.setState({onFocusWeibo: d.id}, ()=>{
                        $context.selectAll('.dmarkP')
                          .attr('opacity', d=>d.id==this.state.onFocusWeibo?'1': '0.55')
                      })

                      EventBus.emit('weibo-click', d.id)

                    })
    $context.selectAll('.dmark')
        .attr("transform", d => {
          return `translate(${x3(d.t)}, ${y3(d.hot)})`;
        })

    //坐标轴绘制
    $context.append('g')
        .attr('class', 'axis x3');

    $context.select('.axis.x3')
      .attr('transform', `translate(0, ${h3+5})`)
      .call(xAxis3);
  }
    
}

export default MainView;