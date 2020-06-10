import React from 'react';
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import './App.css'
import {
  MainView,
  PieChart,
  WordCloud,
  DetailText,
  HotRank,
  TypeLine
} from './components'

function App() {
  return (
    <>
      <Row style={{ marginBottom: '0px' }}>
        <Col span={16}>
          <div className='content' id='mainview'>
            <MainView></MainView>
          </div>
        </Col>
        <Col span={8}>
          <div className='content'>
            <HotRank> </HotRank>
          </div>

        </Col>
      </Row>
      <Row>
        <Col span={10} style={{height: '100%'}}>
          <div className='content'>
            <DetailText> </DetailText>
          </div>
        </Col>
        <Col span={6}>
          <div className='content'>
            <PieChart></PieChart>
          </div>
        </Col>
        <Col span={8}>
          {/* <WordCloud> </WordCloud> */}
          <div className='content'>
            <TypeLine> </TypeLine>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default App;
