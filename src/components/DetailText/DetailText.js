import React from 'react'
import axios from 'axios'
import { Row, Col } from 'antd';
import './DetailText.css'
import TopBar from '../TopBar/TopBar';
import { Typography, Card, Statistic, Tooltip } from 'antd';
import { LikeOutlined, RollbackOutlined, MessageOutlined, FireOutlined } from '@ant-design/icons';


const { Text, Link } = Typography;

const type_key = { 0: '疫情情况', 1: '药品研究', 2: '复工开学', 3: '社会活动', 4: '官方言行', 5: '海外疫况' }

export default class DetailText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '2020032013163140',
            path: '',
            classification: '',
            content: '',
            like: '',
            comment: '',
            transmit: '',
            hot: 0,
            time: '',
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
            console.log(res);
            let rawdata = res.data.result;

            _this.setState(
                {
                    id: rawdata.id,
                    path: rawdata.path,
                    classification: rawdata.classification,
                    content: rawdata.content,
                    like: rawdata.like,
                    comment: rawdata.comment,
                    transmit: rawdata.transmit,
                    hot: rawdata.hot,
                    time: rawdata.t,
                }, () => {
                    console.log(this.state);
                })
        })
    }

    render() {
        return (
            <div>
                {/* <Card title='微博详情' bordered={true}> */}
                {/* <Row>
                    <Col span={24}>col</Col>
                     </Row> */}
                <TopBar>
                    <span id='detail-title'>微博详情</span>
                </TopBar>
                <p></p>
                <Row>
                    <Col span={8}>
                        <Text strong>{type_key[this.state.classification]}</Text>
                    </Col>
                    <Col span={12} offset={4}>{this.state.time}</Col>
                </Row>
                <p></p>
                <Row>
                    <Col span={24}>
                        {/* <Text strong>Ant Design</Text> */}
                        <a href={this.state.path} target="_blank">
                            {this.state.content}
                        </a>
                    </Col>
                </Row>
                <p></p>
                <Row gutter={8}>
                    <Col span={6}>
                        <Tooltip title="点赞数">
                            <span> <LikeOutlined /> {this.state.like} </span>
                        </Tooltip>
                    </Col>
                    <Col span={6}>
                        <Tooltip title="评论数">
                            <span> <MessageOutlined /> {this.state.comment} </span>
                        </Tooltip>
                    </Col>
                    <Col span={6}>
                        <Tooltip title="转发数">
                            <span> <RollbackOutlined /> {this.state.transmit} </span>
                        </Tooltip>
                    </Col>

                    <Col span={6}> <Tooltip title="热度">
                        <span> <FireOutlined /> {this.state.hot} </span>
                    </Tooltip>
                    </Col>
                </Row>

                {/* </Card> */}

            </div>
        )
    }
}

//export default DetailText;