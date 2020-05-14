import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase.js';
import GitHub from './github.js';
import './App.css';
import TechRader from './tech-radar.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
const github =  new GitHub();

class UserRadar extends Component {

  constructor() {
    super();
    this.state = {
      uid: null
      //currentItem: ''
    }
  }

  componentDidMount() {
    const uid = this.props.match.params.uid;
    this.setState({
      uid: uid
      //currentItem: ''
    });
    /*
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });*/
  }

  render() {
    return (
      <div>
        <h1> {this.state.uid } </h1>
        <TechRader></TechRader>
      </div>
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