import React from 'react'
import axios from 'axios'
import './WordCloud.css'
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import 'echarts-wordcloud'

export default class WordCloud extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], //
            id: '2020032013163140',
        }
    }

    componentDidMount() {
        const _this = this;
        axios.post("http://120.27.243.210:3000/getWeibo",
            //参数列表
            {
                'id': _this.state.id
            }
        ).then((res) => {
            //console.log(res);
            let rawdata = res.data.result.cloud;
            //console.log(rawdata);
            let data = _this.dataParse(rawdata);
            //console.log(data);
            _this.setState({ data: data }, () => {
                console.log(this.state.data);
                
            })
        })
    }

    dataParse(rawdata) {
        let data = [];
        for (let i in rawdata) {
            //console.log(i);
            //console.log(rawdata[i]);
            data.push({ name: i, value: rawdata[i] })
        }
        return data;
    }

    getOption = () => {
        let option = {
            backgroundColor: '#fff',
            title: {
                text: '用户评论词云',
                //subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [{
                type: 'wordCloud',
                roam: true,
                gridSize: 2,
                sizeRange: [15, 35],
                //sizeRange: [15, 40],
                rotationRange: [-45, 45],
                rotationStep: 30,
                //shape: 'circle',
                // maskImage: maskImage,
                //drawOutOfBound:true,
                textStyle: {
                    normal: {
                        color: function () {
                            var colors = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                            return colors[parseInt(Math.random() * 10)];
                        }
                    }
                },
                left: 'center',
                top: 0,
                width: '100%',
                height: '100%',
                data: this.state.data
                // data: [
                //     { name: '湖北', value: 120 },
                //     { name: '武汉', value: 102 },
                //     { name: '疫情', value: 80 },
                //     { name: '新冠', value: 70 },
                //     { name: '新增病例', value: 61 }
                // ]
            }]
        };
        return option;
    }

    render() {
        return (
            <div>
                <ReactEcharts option={this.getOption()} />
            </div>
        )
    }
}