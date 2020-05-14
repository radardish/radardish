import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase.js';
import GitHub from './github.js';
import './App.css';
import TechRader from './tech-radar.js';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";

const github =  new GitHub();

class Home extends Component {

  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null,
      accessToken: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this); 
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.setState({ user });
        // TODO restore access for github
        // TODO restore additional user information from firebase
      } 
    });
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
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
    });
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); //
  }
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({ 
          user: null,
          accessToken: null
        });
      });
  }
  login() {
    auth.signInWithPopup(provider) 
      .then(async (result) => {
        const user = result.user;
        const accessToken = result.credential.accessToken;
        console.log("logged in as", result);
        this.setState({
          user,
          accessToken
        });
        let followers = await github.getFollowers(accessToken);
        let following = await github.getFollowing(accessToken);
        
        console.log(followers);
        let userRef = firebase.database().ref('users/'+user.uid);
        userRef.set({
            accessToken,
            githubUsername: result.additionalUserInfo.username
        });
        for (const follower of followers.data) {
          userRef.child("followers/"+follower.login).set(follower);
        }
        for (const entry of following.data) {
          userRef.child("following/"+entry.login).set(entry);
        }
      });
  }

  render() {
    return (
      <TechRader></TechRader>
    );
  }
}
export default withRouter(Home);


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