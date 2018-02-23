//react
import React, { Component} from 'react';
import './App.css';

import {PmaCollectionManager} from './Component_pma.js'
import {PmaType1} from './PmaType1.js'

import Timeline from 'react-visjs-timeline'

const options = {
width: '100%',
height: '100px',
stack: false,
showMajorLabels: true,
showCurrentTime: true,
zoomMin: 1000000,
type: 'background',
format: {
  minorLabels: {
    minute: 'h:mma',
    hour: 'ha'
  }
}
};

const items = [{
  start: new Date(2018, 1, 27),
  end: new Date(2018, 2, 28),  // end is optional
  content: 'evenement',
  style: "color: red; background-color: pink;"
}]

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <p className="App-intro"></p>
        <PmaCollectionManager queries={"q***"} typePma={PmaType1}/>
        <Timeline options={options} items={items}/>
      </div>
    );
  }
}

export default App;
