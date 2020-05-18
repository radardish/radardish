import React, { Component } from 'react';
import firebase from './firebase.js';
import './App.css';
import TechRader from './tech-radar.js';
import {
  withRouter
} from "react-router-dom";

class MyRadar extends Component {

  constructor(props){
    super(props);
    this.state = {
      entries: [],
      currentTechnology: '',
      currentChange: 0,
      currentQuadrant: 0,
      currentRing: 0,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const technologiesRef = firebase.database().ref('radars/'+this.props.githubUsername);
    const item = {
      "moved": Number(this.state.currentChange),
      "quadrant": Number(this.state.currentQuadrant),
      "ring": Number(this.state.currentRing)
    };
    technologiesRef.child(this.state.currentTechnology)
      .set(item)
    this.setState({
      currentTechnology: '',
      currentChange: 0,
      currentQuadrant: 0,
      currentRing: 0
    });
  }

  componentDidMount() {
    this.setState({
      entries: [],
      currentTechnology: '',
      currentChange: 0,
      currentQuadrant: 0,
      currentRing: 0,
    });
    
    const itemsRef = firebase.database().ref('radars/'+this.props.githubUsername);
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
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <label className="sr-only">Technology</label>
          <input type="text" className="form-control mb-2 mr-sm-2" id="currentTechnology" placeholder="Kotlin" onChange={this.handleChange} value={this.state.currentTechnology}></input>

          <label className="sr-only">Change</label>
          <select className="form-control" id="currentChange" onChange={this.handleChange} value={this.state.currentChange}>
            <option value="0">Unchanged</option>
            <option value="1">Up</option>
            <option value="-1">Down</option>
          </select>

          <label className="sr-only">Quadrant</label>
          <select className="form-control" id="currentQuadrant" onChange={this.handleChange} value={this.state.currentQuadrant}>
            <option value="0">Languages</option>
            <option value="1">Infrastructure</option>
            <option value="2">Frameworks</option>
            <option value="3">Data Management</option>
          </select>

          <label className="sr-only">Ring</label>
          <select className="form-control" id="currentRing" onChange={this.handleChange} value={this.state.currentRing}>
            <option value="3">HOLD</option>
            <option value="2">ASSESS</option>
            <option value="1">TRIAL</option>
            <option value="0">ADOPT</option>
          </select>

          <button type="submit" className="btn btn-primary mb-2">Save</button>
        </form>
      </main>
    );
  }
}
export default withRouter(MyRadar);