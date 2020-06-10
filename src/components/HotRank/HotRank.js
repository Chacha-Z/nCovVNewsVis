import React from 'react'
import axios from 'axios'
import './HotRank.css'
import TopBar from '../TopBar/TopBar';
import { Row, Col } from 'antd';
import { List, Typography, Card } from 'antd';

const type_key = { 0: '国内疫况', 1: '药品研究', 2: '复工开学', 3: '社会言行', 4: '官方言行', 5: '海外疫况' }

const type_icon = {'0':'path://M958.733019 411.348626 659.258367 353.59527 511.998465 85.535095 364.741633 353.59527 65.265958 411.348626 273.72878 634.744555 235.88794 938.463881 511.998465 808.479435 788.091594 938.463881 750.250754 634.744555Z'}

export default class HotRank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            begin: "2020-02-07",
            end: "2020-02-10",
            rank: [],
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
            console.log(res);
            let rank = res.data.rank;
            let data = _this.dataParse(rank);

            _this.setState(
                {
                    rank: rank,
                    data: data
                }, () => {
                    console.log(this.state);
                })
        })
    }

    dataParse(rank) {
        let data = [];
        let content = '';
        for (let i in rank) {
            //console.log(rank[i]);
            content = rank[i].content;
            data.push({
                rank: Number(i) + 1,
                hot: rank[i].hot,
                //title: content.substring(content.indexOf("【") + 1, content.indexOf("】")),
                title: this.titleParse(content),
                id: rank[i].id,
                //classification: rank[i].classification,
                icon: type_icon[rank[i].classification],
            });
        }
        console.log(data);
        return data;
    }

    titleParse(str) {
        if (str.length > 25) {
            console.log(str.substring(0, 30));
            return str.substring(0, 30) + '...';
        } else {
            return str + '...';
        }
    }

    render() {
        return (
            <div>
                {/* <Card title='微博热榜' bordered={false}> */}
                <TopBar>
                    <span id='top-title'>微博热榜</span>
                </TopBar>
                <List
                    size="small"
                    //header={<div>Header</div>}
                    //bordered
                    dataSource={this.state.data}
                    renderItem={item => <List.Item>{item.rank} {item.title} </List.Item>}
                />

                {/* <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    //   avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={item.title}
                                // description="Ant Design"
                                />
                            </List.Item>
                        )}
                    /> */}
                {/* </Card> */}
            </div>
        )
    }
}