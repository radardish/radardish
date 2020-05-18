import React, { Component } from 'react';
import firebase from './firebase.js';
import './App.css';
import TechRader from './tech-radar.js';
import {
  withRouter
} from "react-router-dom";

class UserRadar extends Component {

  constructor() {
    super();
    this.state = {
      uid: null,
      entries: []
      //currentItem: ''
    }
  }

  componentDidMount() {
    const uid = this.props.match.params.uid;
    this.setState({
      uid: uid
      //currentItem: ''
    });
    
    const itemsRef = firebase.database().ref('radars/'+uid);
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          label: item,
          quadrant: items[item].quadrant,
          ring: items[item].ring,
          moved: items[item].moved,
          active: items[item].active,
          link: items[item].link
        });
      }
      this.setState({
        entries: newState
      });
    }); 
  }

  render() {
    return (
      <main role="main" className="container-fluid">
        <h1> {this.state.uid } </h1>
        <TechRader entries={this.state.entries}></TechRader>
      </main>
    );
  }
}
export default withRouter(UserRadar);


/*
<header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
            {this.state.user ?
              <button onClick={this.logout}>Log Out</button>                
              :
              <button onClick={this.login}>Log In</button>              
            }
          </div>
          {this.state.user ?
          <div>
            <div className='user-profile'>
              <img src={this.state.user.photoURL} />
            </div>
            <section className="add-item">
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
                <button>Add Item</button>
              </form>
            </section>
          </div>
          :
          <div className='wrapper'>
            <p>You must be logged in to see the potluck list and submit to it.</p>
          </div>
          }
        </header>
        <div className='container'>
          <section className='display-item'>
            <div className="wrapper">
              <ul>
                {this.state.items.map((item) => {
                  return (
                    <li key={item.id}>
                      <h3>{item.title}</h3>
                      <p>brought by: {item.user}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </div>
*/