// src/App.js
import React, { Component } from 'react';
import { Button } from 'antd';
import { Input } from 'antd';

import './App.css';

import Screen from './components/Screen'



class App extends Component {

  constructor(props) {
    super(props);
    /* 实例化 WebSocket 连接对象, 地址为 ws 协议 */
    this.webSocket = new WebSocket("ws://localhost:3030/api");
    /* 连接到服务端时*/
    /* type为消息类型*/
    this.webSocket.onopen = () => {
      this.webSocket.send(JSON.stringify({
        type: 'goOnline',
        time: new Date().toLocaleString()
      }));
    };

    this.webSocket.onmessage = (msg) => {
      let message = JSON.parse(msg.data);
      // console.log(message);
      if (message.type === 'chat') {
        //准备显示
        let message2add = {}
        message2add["id"] = this.state.id
        message2add["val"] = message.content
        message2add["isMine"] = (message.name === this.state.name ? true : false)
        // console.log(message2add)
        //加入state
        const infolist = [...this.state.info];
        infolist.push(message2add)
        const keylist = [...this.state.keys];
        keylist.push(this.state.id)
        this.setState((prevState) => ({   //外面加小括号可以代替return
          info: infolist,
          id: this.state.id + 1,
          keys: keylist,
        }));
      } else if (message.type === 'setName') {//设置自己的id
        this.setState({ name: message.name })
      } else {
        console.log(msg)
      }

    }

    /* 关闭时 */
    this.webSocket.onclose = () => {
      this.webSocket.send(JSON.stringify({
        type: 'goOutline',
        time: new Date().toLocaleString()
      }));
    };

    this.state = {
      name: '',
      inputValue: '',
      id: 0,
      keys: [],
      info: [],
    }

    this.ClearBr = this.ClearBr.bind(this)
    this.send = this.send.bind(this)
  }

  //发送消息
  send() {
    var str = this.ClearBr(this.state.inputValue);
    if (str && str !== '') {
      this.webSocket.send(JSON.stringify({
        name: this.state.name,
        type: 'chat',
        content: str,
        time: new Date().toLocaleString()
      }));
      this.setState(() => ({ inputValue: "" }))
    }
  }

  //去除换行 
  ClearBr(key) {
    key = key.replace(/<\/?.+?>/g, "");
    key = key.replace(/[\r\n]/g, "");
    return key;
  }

  //在输入框发生变化的时候修改状态的值
  handleMaxBackUp = (event) => {
    if (event && event.target && event.target.value) {
      let value = event.target.value;
      this.setState(() => ({ inputValue: value }))
    }
  }

  //点击button的时候打出输入框中的值
  alertData = () => {
    this.send();
  }

  render() {
    return (
      <div className="App">
        <Screen info={this.state.info} keys={this.state.keys} />
        <div className="bottomBox">
          <Input placeholder="Type something here" value={this.state.inputValue} onChange={event => this.handleMaxBackUp(event)} />
          <Button type="primary" onClick={() => { this.alertData() }}>Button</Button>
        </div>

      </div>
    );
  }
}

export default App;