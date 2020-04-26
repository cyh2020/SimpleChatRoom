// src/App.js
import React, { Component } from 'react';
import './SmallTalks.css';

class SmallTalks extends Component {
  constructor(props){
    super(props);
    this.state={active :props.isMine,msg:props.val};
  }
  render() {
    return (
      <div className={` SmallTalks  ${this.state.active ? 'mine' : ''} `}>
        <div className = "title"></div>
        <div className = "msg">{this.state.msg}</div>
      </div>
    );
  }
}

export default SmallTalks;