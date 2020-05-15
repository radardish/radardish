import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase.js';
import GitHub from './github.js';
import './App.css';
import Home from './Home.js';
import UserRadar from './UserRadar.js';
import MyRadar from './MyRadar.js';

import { Route, Link, withRouter } from "react-router-dom";

const github =  new GitHub();

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      accessToken: null,
      githubUsername: null
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this); 
  }

  componentDidMount() {
    let path = localStorage.getItem('path');
    if(path) {
      localStorage.removeItem('path');
      this.props.history.push(path);
    }
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.setState({ user });
        var userRef = firebase.database().ref('users/'+user.uid);
        userRef.once("value", snapshot => {
          var item = snapshot.val();
          var accessToken = item.accessToken;
          var githubUsername = item.githubUsername;
          console.log("Restored user", accessToken, githubUsername)
          this.setState({ 
            accessToken,
            githubUsername
          });
        })
        // TODO restore access for github
        // TODO restore additional user information from firebase
      } 
    });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({ 
          user: null,
          accessToken: null,
          githubUsername: null
        });
      });
  }

  login() {
    auth.signInWithPopup(provider) 
      .then(async (result) => {
        const user = result.user;
        const accessToken = result.credential.accessToken;
        const githubUsername = result.additionalUserInfo.username;
        console.log("logged in as", result);
        this.setState({
          user,
          githubUsername,
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
      <div className='app'>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <Link className="navbar-brand" to="/">Radardish</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="navbar-nav mr-auto">
            {this.state.user ?
              <li className="nav-item">
                <Link className="nav-link" to="/my">My Radar</Link>
              </li>
              :
              <li></li>
            }
          </ul>
          <div className="form-inline my-2 my-lg-0">
            {this.state.user ?
              <button className="btn btn-dark" onClick={this.logout}>Log Out</button> 
              :
              <button className="btn btn-light" onClick={this.login}><i className="fa fa-github" aria-hidden="true"></i> Login</button>
                   
            }
          </div>
        </nav>

        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/my">
          {this.state.githubUsername ?
            <MyRadar githubUsername={this.state.githubUsername}/>
            :
            <h1>Loading Data</h1>
          }
        </Route>
        <Route path="/u/:uid" children={<UserRadar />} />
      </div>
    );
  }
}
export default withRouter(App);


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