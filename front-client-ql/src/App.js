//react
import React, { Component } from 'react';
import './App.css';
// client side
import {s_pushpma} from './Service.js'
import {PmaType0} from './Component_pma.js'

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
      </div>
    );
  }
}

export default App;
