//react
import React, { Component} from 'react';
import './App.css';

import {PmaCollectionManager} from './Component_pma.js'
import {PmaType1} from './PmaType1.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <p className="App-intro"></p>
        <PmaCollectionManager queries={"q***"} typePma={PmaType1}/>
      </div>
    );
  }
}

export default App;
