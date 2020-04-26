// src/App.js
import React, { Component } from 'react';
import SmallTalks from './SmallTalks';
import './Screen.css';

class Screen extends Component {
  state = { 
    msgs: this.props.info,
    prevkeys: this.props.keys
   };

  // static getDerivedStateFromProps(nextProps) {        
  //   this.setState({
  //     msgs: nextProps.info
  //   });
  // }

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.keys !== state.prevkeys) {
      return {
        prevkeys: props.keys,
        msgs: props.info
      };
    }
    return null;
  }

  componentDidUpdate(){
    let messageListEl = document.getElementById('Screen');
    messageListEl.scrollTo(0, messageListEl.scrollHeight);
  }


  // 获取数据

  render() {
    let listItems = this.state.msgs.map((msg) =>
      <SmallTalks key={msg.id} val={msg.val} isMine={msg.isMine} />
    );

    return (
      <div className="Screen" id = "Screen">
        {listItems}
      </div>
    );
  }
}

export default Screen;