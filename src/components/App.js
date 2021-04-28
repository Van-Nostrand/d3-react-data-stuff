import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import "../scss/main.scss";

export default function App(){

  const ROOT_API = "https://api.covid19api.com/"
  const CANADA_CASES = "dayone/country/canada"

  let canvas = useRef(null);

  let [ receivedData, setReceivedData ] = useState([]);

  useEffect(() => {
    //do something with axios here
    axios.get(ROOT_API + CANADA_CASES)
      .then((response, i) => setReceivedData(response.data))
      .catch(err => console.error(err));
    
  },[]);

  useEffect(() => {
    
  },[receivedData, canvas.current]);
  
  if (!receivedData || receivedData.length < 1) {
    console.log("data not received yet")
    return (
      <div className="main-container">
        <div>LOADING</div>
      </div>
    )
  }
  console.log("data received")


  // let svgElement = <svg className="svg-container" ref={canvas} xmlns="http://www.w3.org/2000/svg"></svg>;

  // console.log(receivedData)

  let svgWidth = 1000;
  let svgHeight = 700;
  let padding = 30;
  let barPadding = 1;
  
  let xScale = d3.scaleTime()
                    .domain(d3.extent(receivedData, d => new Date(d.Date)))
                    .range([padding, svgWidth - padding]);

  let histogram = d3.bin()
                    .domain(xScale.domain())
                    .thresholds(d => d.length)
                    .value(d => d.Confirmed);
  
  let bins = histogram(receivedData);

  // console.log(bins);

  let barWidth = svgWidth / bins.length - barPadding;

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.Confirmed)])
    .range([svgHeight, 0]);


  let bars = d3.select(canvas.current)
                  .attr('width', svgWidth)
                  .attr('height', svgHeight)
                .selectAll('.bar')
                .data(bins)
                .enter()
                .append('g')
                  .classed('bar', true);

  

  bars.append('rect')
        .attr('x', d => xScale(d.x0))
        .attr('y', d => yScale(d.length))
        .attr('height', d => svgHeight - yScale(d.length))
        .attr('width', d => xScale(d.x1) - xScale(d.x0) - barPadding)
        .attr('fill', '#9c27b0');
  // }

  return(
    <div className="main-container">
      <div>d3 svg party!!</div>
      <svg className="svg-container" ref={canvas} xmlns="http://www.w3.org/2000/svg"></svg>
      {/* {svgElement} */}
    </div>
  )
}

