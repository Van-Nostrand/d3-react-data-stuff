import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import "../scss/main.scss";
import * as DATA from "./DATA.json";

export default function App(){

  const ROOT_API = "https://api.covid19api.com/"
  const CANADA_CASES = "dayone/country/canada"

  let canvas = useRef(null);

  let [ receivedData, setReceivedData ] = useState(DATA);

  // useEffect(() => {
  //   //do something with axios here
  //   axios.get(ROOT_API + CANADA_CASES)
  //     .then((response, i) => setReceivedData(response.data))
  //     .catch(err => console.error(err));
    
  // },[]);

  useEffect(() => {
    if (receivedData && canvas.current){
      let svgWidth = 1200;
      let svgHeight = 700;
      let padding = 30;
      let barPadding = 1;

      let bins = d3.bin()
                    .thresholds(d => d.length)
                    .value(d => new Date(d.Date))
                    (receivedData);

      let xScale = d3.scaleLinear()
                        .domain([0, bins.length - 1])
                        .range([padding, svgWidth - padding]);

      let yScale = d3.scaleLinear()
                        .domain([0, d3.max(bins.map(item => item[0].Confirmed))])
                        .range([padding, svgHeight - padding]);

      let barWidth = Math.floor(svgWidth / bins.length - barPadding);


      let bars = d3.select(canvas.current)
                    .attr('width', svgWidth)
                    .attr('height', svgHeight)
                    .append('g')
                      // .attr('transform', `translate(${padding},${padding})`)
                    .selectAll('rect')
                    .data(bins)
                    .enter()
                    .append('rect')
                      .attr('x', (d, i) => Math.floor(xScale(i)))
                      .attr('y', d => Math.floor(svgHeight - padding - yScale(d[0].Confirmed)))
                      .attr('height', d => Math.floor(yScale(d[0].Confirmed) - padding + 1))
                      .attr('width', barWidth)
                      .attr('fill', '#9c27b0');

      bars.exit()
        .remove();
    }
  },[receivedData, canvas.current]);
  
  if (!receivedData || receivedData.length < 1) {
    return (
      <div className="main-container">
        <div>LOADING</div>
      </div>
    )
  }

  return(
    <div className="main-container">
      <div>d3 svg party!!</div>
      <svg className="svg-container" ref={canvas} xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
  )
}

