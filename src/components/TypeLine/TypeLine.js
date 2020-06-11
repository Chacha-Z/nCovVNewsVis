import React from 'react'
import './TypeLine.css'
import TopBar from '../TopBar/TopBar';
import axios from 'axios'
import ReactEcharts from 'echarts-for-react';
import EventBus from '../../utils/EventBus'

//const color = ['#63a0cb','#eba0d4','#ba9dd4','#e88788','#b18d85','#8ecc8e']
const color = ['#f6d54a', '#f69846', '#ad46f3', '#ff3d3d', '#9daaff', '#6be990'] 

export default class TypeLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            begin: "",
            end: "",
            data: [],
            max: 0
        }
    }

    componentDidMount() {
        EventBus.addListener('time-brush', (r) => {
            console.log('r: ', r)
            this.setState({begin: r[0],end:r[1]}, ()=>{
                this.uploadData(this.state.begin, this.state.end)
            })
        })
    }

    uploadData(begin, end){
         const _this = this;
        axios.post("http://120.27.243.210:3000/postTime",
            //参数列表
            {
                'begin': begin,
                'end': end
            }
        ).then((res) => {
            console.log(res);
            let classification = res.data.classification;
            let data = _this.dataParse(classification);
            console.log(data)
            let max = _this.getMaxType(classification);
            console.log(max)
            _this.setState(
                {
                    data: data,
                    max: max
                }, () => {
                    console.log(this.state);
                })
        })
    }
    dataParse(classification) {
        let data = [];
        for (let i in classification) {
            data.push(classification[i]);
        }
        return data;
    }

    getMaxType(data){
        let temp = data[0]
        let max = 0
        for (let i in data){
            if (data[i] > temp){
                temp = data[i]
                max = i
            }
        }
        return max
    }

    getOption = () => {
        //const _this = this;
        let option = {
            title: {
                //text: '用户评论情绪饼图',
                subtext: this.state.begin + ' ~ ' + this.state.end,
                left: 'center',
                subtextStyle: {
                    color: 'white',
                    fontSize: 15,
                }
                
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: function (params) {
                    return params[0].name + ': ' + params[0].value;
                }
            },
            xAxis: {
                data: ['国内疫况', '药品研究', '复工开学', '社会人文', '官方言行', '海外疫况'],
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: 'white'
                    }
                }
            },
            yAxis: {
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
           // color: [color[this.state.max]],
            color:'white',
            series: [{
                name: 'hill',
                type: 'pictorialBar',
                barCategoryGap: '-130%',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z', //柱子形状
                itemStyle: {
                    normal: {
                        opacity: 0.75
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: this.state.data,
                z: 10
            }, {
                name: 'glyph',
                type: 'pictorialBar',
                barGap: '-100%',
                symbolPosition: 'end',
                symbolSize: 20,
                symbolOffset: [0, '-120%'],
                data: [
                    {
                        value: this.state.data[0],
                        symbol: 'circle',
                        symbolSize: [17, 17],
                        itemStyle:{
                            color:color[0]
                        },
                    },
                    {
                        value: this.state.data[1],
                        symbol: 'rect',
                        symbolSize: [15, 15],
                        itemStyle:{
                            color:color[1]
                        },
                    },
                    {
                        value: this.state.data[2],
                        symbol: 'path://M0,-7.847549217020565L6.796176979388489,3.9237746085102825L-6.796176979388489,3.9237746085102825Z',
                        itemStyle:{
                            color:color[2]
                        },
                    },
                    {
                        value: this.state.data[3], //五角星
                        // symbol: 'path://M958.733019 411.348626 659.258367 353.59527 511.998465 85.535095 364.741633 353.59527 65.265958 411.348626 273.72878 634.744555 235.88794 938.463881 511.998465 808.479435 788.091594 938.463881 750.250754 634.744555Z',
                        symbol:'path://M0,-8.441862787462423L1.8953162830083747,-2.6086790655073533L8.028688613685706,-2.6086790655073537L3.0666861653386652,0.9964267372834953L4.962002448347041,6.829610459238564L6.661338147750939e-16,3.2245046564477153L-4.9620024483470395,6.829610459238565L-3.0666861653386652,0.9964267372834958L-8.028688613685707,-2.608679065507352L-1.8953162830083754,-2.608679065507353Z',
                        symbolSize: [22, 22],
                        itemStyle:{
                            color:color[3]
                        },
                    },
                    {
                        value: this.state.data[4],
                        symbol: 'path://M-6,-2L-2,-2L-2,-6L2,-6L2,-2L6,-2L6,2L2,2L2,6L-2,6L-2,2L-6,2Z', //十字架
                        symbolSize: [18, 18],
                        itemStyle:{
                            color:color[4]
                        },
                    },
                    {
                        value: this.state.data[5],
                        symbol: 'path://M2.413666666266791,1.3935310995031587L2.413666666266791,6.220864432036741L-2.413666666266791,6.220864432036741L-2.413666666266791,1.393531099503158L-6.594259964776267,-1.0201355667636332L-4.180593298509475,-5.200728865273108L0,-2.787062199006317L4.180593298509475,-5.200728865273108L6.594259964776267,-1.0201355667636332Z',
                        symbolSize: [17, 17], // Y
                        itemStyle:{
                            color:color[5]
                        },
                    },
                ]
            }]
        };
        return option;
    }

    render() {
        return (
            // <div style={{ height: '220px', width: '480px' }}> 
            <div style={{ height: '100%'}}>
                <TopBar>
                    <span id='top-title'>事件类别统计</span>
                </TopBar>
                <ReactEcharts option={this.getOption()} />
            </div>
        )
    }
}