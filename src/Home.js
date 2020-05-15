import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase.js';
import GitHub from './github.js';
import './App.css';
import { Link, withRouter } from "react-router-dom";

const github =  new GitHub();

class Home extends Component {

  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null,
      accessToken: null,
      entries: []
    }
    this.login = this.login.bind(this);
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
      <main role="main" className="container">
        <div class="jumbotron">
          <div class="container">
            <h1 class="display-3">Curate your own Tech-Radar and share it with the world</h1>
            <p>Login with your Github account and create your own Tech Radar. The changed are directly shared with your followers on Github.</p>
            {this.state.user ?
              <p><Link className="btn btn-light" to="/my">My Rader</Link></p>
              :
              <p><button class="btn btn-light" onClick={this.login}>Login using GitHub</button></p>
            }
            
          </div>
        </div>
      </main>
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