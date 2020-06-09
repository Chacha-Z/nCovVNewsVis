import React from 'react';
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import './App.css'
import {
  PieChart,
  WordCloud,
  DetailText,
  HotRank,
  TypeLine
} from './components'

function App() {
  return (
    <>
      <Row style={{ marginBottom: '4px' }} gutter={4}>
        <Col span={6}>
          <div className='content'></div>
        </Col>
        <Col span={12}>
         
         
        </Col>
        <Col span={6}>
          <HotRank> </HotRank>
        </Col>
      </Row>
      <Row gutter={4}>
        <Col span={10}>
          <DetailText> </DetailText>
        </Col>
        <Col span={6}>
          <PieChart></PieChart>
        </Col>
        <Col span={8}>
          {/* <WordCloud> </WordCloud> */}
          <TypeLine> </TypeLine>
        </Col>
      </Row>
    </>
  );
}

export default App;
