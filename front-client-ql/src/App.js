//react
import React, { Component} from 'react';
import './App.css';

import {PmaCollectionManager} from './Pma/Component_pma.js'
import {PmaSelector} from './Pma/PmaSelector.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTypePma: null,
    }
    // permet de changer de type de pma
    this.onSelection = this.onSelection.bind(this)
  }

  onSelection(pmaType){
    this.pmaCollection.updatePmaType(pmaType)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p id="App-subheader">Kiabi pma Admin</p>
        </header>
        <p className="App-intro"></p>
        <img src={require('./static/kiabi-logo.png')} alt="kiabilogo"/>
        <PmaSelector
          onSelection = {this.onSelection}
        />
        <PmaCollectionManager
          ref = {(pmaCollection) => { this.pmaCollection = pmaCollection}}
        />
        <footer id="App-footer">
        </footer>
      </div>
    );
  }
}

export default App;
