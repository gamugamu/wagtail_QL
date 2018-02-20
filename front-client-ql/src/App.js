//react
import React, { Component } from 'react';
import './App.css';
// client side
import {s_pushpma} from './Service.js'
import {PmaType0, PmaType1} from './Component_pma.js'
import Timeline from 'react-visjs-timeline'

const options = {
width: '100%',
height: '60px',
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
  start: new Date(2010, 7, 15),
  end: new Date(2010, 8, 2),  // end is optional
  content: 'Trajectory A',
}]

class App extends Component {
  // à déplacer dans controller.
  validatePma(pma){
    if(this.pmaType0.state.image !== null){
      s_pushpma("dummy-title", this.pmaType0.state.image[0]);
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <p className="App-intro"></p>

        <PmaType0
          ref         = {(node) => { this.pmaType0 = node; }}
          onValidate  = {()     => this.validatePma()}
        />
        <PmaType1/>
        <Timeline options={options} items={items}/>
      </div>
    );
  }
}

export default App;
