//react
import React, { Component} from 'react';
import './App.css';

import {PmaCollectionManager} from './Component_pma.js'
import {PmaSelector} from './PmaSelector.js'


import {Pmatype1} from './PmaType1.js'

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
      console.log("selected", pmaType);
      /*
      this.setState({
        currentTypePma: pmaLabel
      })
*/
      this.pmaCollection.updatePmaType(pmaType)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <p className="App-intro"></p>
        <PmaSelector
          onSelection = {this.onSelection}
        />
        <PmaCollectionManager
          ref = {(pmaCollection) => { this.pmaCollection = pmaCollection;}}
        />
      </div>
    );
  }
}

export default App;
