import React, { Component } from 'react';

class TechRader extends Component {
  componentDidMount() {
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
        { name: "Bottom Right" },
        { name: "Bottom Left" },
        { name: "Top Left" },
        { name: "Top Right" }
      ],
      rings: [
        { name: "INNER",  color: "#93c47d" },
        { name: "SECOND", color: "#b7e1cd" },
        { name: "THIRD",  color: "#fce8b2" },
        { name: "OUTER",  color: "#f4c7c3" }
      ],
      print_layout: true,
      entries: [
      {
          label: "Some Entry",
          quadrant: 3,          // 0,1,2,3 (counting clockwise, starting from bottom right)
          ring: 2,              // 0,1,2,3 (starting from inside)
          moved: -1             // -1 = moved out (triangle pointing down)
                                //  0 = not moved (circle)
                                //  1 = moved in  (triangle pointing up)
      },
      {
        quadrant: 0,
        ring: 0,
        label: "Python",
        active: true,
        link: "python.html",
        moved: 0
      }
      ]
    });
  }
  
  render() {
    var styleObj = {
    }
    return (
      <svg id="radar" style={styleObj}></svg>
    )
  }
}

export default TechRader;