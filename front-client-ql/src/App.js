//react
import React, { Component} from 'react';
import './App.css';

import {PmaCollectionManager} from './Component_pma.js'
import {Pmatype1} from './PmaType1.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <p className="App-intro"></p>
        <PmaCollectionManager typePma={Pmatype1}/>
      </div>
    );
  }
}

export default App;
