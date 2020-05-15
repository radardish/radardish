import React, { Component } from 'react';

class TechRader extends Component {

  constructor() {
    super();
  }


  componentDidMount() {
  }
  
  render() {
    window.radar_visualization({
      svg_id: "radar",
      width: 1450,
      height: 1000,
      colors: {
        background: "#fff",
        grid: "#bbb",
        inactive: "#ddd"
      },
      title: "My Radar",
      quadrants: [
        { name: "Languages" },
        { name: "Infrastructure" },
        { name: "Frameworks" },
        { name: "Data Management" }
      ],
      rings: [
        { name: "ADOPT",  color: "#93c47d" },
        { name: "TRIAL", color: "#b7e1cd" },
        { name: "ASSESS",  color: "#fce8b2" },
        { name: "HOLD",  color: "#f4c7c3" }
      ],
      print_layout: true,
      entries: this.props.entries
    });

    var styleObj = {
    }
    return (
      <svg id="radar" style={styleObj}></svg>
    )
  }
}

export default TechRader;