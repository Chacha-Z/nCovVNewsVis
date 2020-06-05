import React from 'react';
import {  Row, Col  } from 'antd';
import 'antd/dist/antd.css';
import './App.css'
import{
  Header,
  MainView
} from './components'

function App() {
  return (
    <>
      <Row style={{marginBottom:'4px'}}>
        <Col span={6}>
          <div className='content'></div>
        </Col>
        <Col span={12}>
          <div className='content'>
            <MainView></MainView>
          </div>
        </Col>
        <Col span={6}>
          <div className='content'></div>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <div className='content'></div>
        </Col>
        <Col span={8}>
          <div className='content'></div>
        </Col>
        <Col span={8}>
          <div className='content'></div>
        </Col>
      </Row>
    </>
  );
}

export default App;
