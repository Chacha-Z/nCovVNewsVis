import React from 'react'
import './TypeLine.css'
import TopBar from '../TopBar/TopBar';
import axios from 'axios'
import ReactEcharts from 'echarts-for-react';


export default class TypeLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            begin: "2020-02-07",
            end: "2020-02-10",
            data: []
        }
    }

    componentDidMount() {
        const _this = this;
        axios.post("http://120.27.243.210:3000/postTime",
            //参数列表
            {
                'begin': _this.state.begin,
                'end': _this.state.end
            }
        ).then((res) => {
            //console.log(res);
            let classification = res.data.classification;
            let data = _this.dataParse(classification);

            _this.setState(
                {
                    data: data
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

    getOption = () => {
        let option = {
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
                data: ['国内疫况', '药品研究', '复工开学', '社会言行', '官方言行', '海外疫况'],
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#e54035'
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
            color: ['#e54035'],
            series: [{
                name: 'hill',
                type: 'pictorialBar',
                barCategoryGap: '-130%',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z', //柱子形状
                itemStyle: {
                    normal: {
                        opacity: 0.5
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

                    },
                    {
                        value: this.state.data[1],
                        symbol: 'rect',
                        symbolSize: [17, 17]
                    },
                    {
                        value: this.state.data[2],
                        symbol: 'triangle',
                    },
                    {
                        value: this.state.data[3], //五角星
                        symbol: 'path://M958.733019 411.348626 659.258367 353.59527 511.998465 85.535095 364.741633 353.59527 65.265958 411.348626 273.72878 634.744555 235.88794 938.463881 511.998465 808.479435 788.091594 938.463881 750.250754 634.744555Z',
                    },
                    {
                        value: this.state.data[4],
                        symbol: 'path://M404.82 912V619.18H112V404.82h292.82V112h214.36v292.82H912v214.36H619.18V912z', //十字架
                    },
                    {
                        value: this.state.data[5],
                        symbol: 'path://M438.667077 591.098245 237.304589 0l155.338466 0 117.927933 407.002156 2.877733 0L631.376655 0l155.318756 0L585.352633 591.098245l0 432.901755-146.685556 0L438.667077 591.098245z',
                        symbolSize: [15, 15] // Y
                    },
                ]
            }]
        };
        return option;
    }

    render() {
        return (
            <div style={{ height: '220px', width: '480px' }}>
                <TopBar>
                    <span id='type-title'>事件类别统计</span>
                </TopBar>
                <ReactEcharts option={this.getOption()} />
            </div>
        )
    }
}