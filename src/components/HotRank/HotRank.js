import React from 'react'
import axios from 'axios'
import './HotRank.css'
import TopBar from '../TopBar/TopBar';
import { List, Avatar } from 'antd';

const type_key = { 0: '国内疫况', 1: '药品研究', 2: '复工开学', 3: '社会言行', 4: '官方言行', 5: '海外疫况' }

const type_icon = { '0': <svg t="1591709355635" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7745" width="16" height="16"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#63a0cb" p-id="7746"></path></svg>,

'1':<svg t="1591714609721" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8809" width="16" height="16"><path d="M0 0h1024v1024H0z" fill="#eba0d4" p-id="8810"></path></svg>, 

'2':<svg t="1591715187708" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9643" width="16" height="16"><path d="M512 78.56348067L959.732278 774.76985266l-895.463532 1e-8L512 78.56348067z" p-id="9644" fill="#ba9dd4"></path></svg>,

'3': <svg t="1591715992512" class="icon" viewBox="0 0 1080 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17192" width="16" height="16"><path d="M1077.529145 388.206248C1072.06379 371.533456 1056.511742 360.326019 1039.008769 360.326019L686.956883 360.326019 578.161726 27.824884C572.876243 11.207437 557.37954 0 539.765877 0 522.262904 0 506.710856 11.207437 501.370028 27.700357L392.450343 360.326019 40.467639 360.326019C22.909321 360.326019 7.398781 371.533456 2.002608 388.206248-3.462747 404.713004 2.528389 422.963139 16.682967 433.119014L301.504067 638.533348 192.764255 971.214355C187.243555 987.776457 193.234691 1005.860556 207.444614 1016.127121 221.474665 1026.338342 240.845544 1026.338342 254.944776 1016.127121L539.765877 810.588261 824.642322 1016.127121C831.629675 1021.191223 839.972989 1023.820128 848.371649 1023.820128 856.701127 1023.820128 865.099787 1021.191223 872.142485 1016.127121 886.297062 1005.860556 892.288199 987.776457 886.767498 971.214355L778.138377 638.533348 1062.793441 433.119014C1076.934183 422.963139 1082.869974 404.713004 1077.529145 388.206248Z" fill="#e88788" p-id="17193"></path></svg>, 

'4':<svg t="1591715742447" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14897" width="16" height="16"><path d="M1024.005978 313.807802 710.192198 313.807802 710.192198 0 313.808549 0 313.808549 313.807802 0 313.807802 0 710.192198 313.808549 710.192198 313.808549 1024 710.192198 1024 710.192198 710.192198 1024.005978 710.192198Z" fill="#b18d85" p-id="14898"></path></svg>,

'5':<svg t="1591715842555" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16413" width="16" height="16"><path d="M438.667077 591.098245 237.304589 0l155.338466 0 117.927933 407.002156 2.877733 0L631.376655 0l155.318756 0L585.352633 591.098245l0 432.901755-146.685556 0L438.667077 591.098245z" p-id="16414" fill="#8ecc8e"></path></svg>}


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
                classification: rank[i].classification,
                icon: type_icon[rank[i].classification],
            });
        }
        console.log(data);
        return data;
    }

    titleParse(str) {
        if (str.length > 25) {
            //console.log(str.substring(0, 30));
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
                    <span id='hotrank-title'>微博热榜</span>
                </TopBar>
                <List
                    size="small"
                    //header={<div>Header</div>}
                    //bordered
                    dataSource={this.state.data}
                    renderItem={item =>
                        <List.Item>                      
                        {item.rank} {item.title}  {item.icon}
                        </List.Item>}
                />
                {/* </Card> */}
            </div>
        )
    }
}