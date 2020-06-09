import React from 'react'
import axios from 'axios'
import './HotRank.css'
import { Row, Col } from 'antd';
import { List, Typography, Card } from 'antd';

const type_key = { 0: '国内疫况', 1: '药品研究', 2: '复工开学', 3: '社会言行', 4: '官方言行', 5: '海外疫况' }

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
                title: content.substring(content.indexOf("【")+1,content.indexOf("】") ),
                id: rank[i].id,
            });
        }
        console.log(data);
        return data;
    }

    render() {
        return (
            <div>
                <Card title='微博热榜' bordered={false}>
                    <List
                        size="small"
                        //header={<div>Header</div>}
                        //bordered
                        dataSource={this.state.data}
                        renderItem={item => <List.Item>{item.rank} {item.title}</List.Item>}
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
                </Card>
            </div>
        )
    }
}