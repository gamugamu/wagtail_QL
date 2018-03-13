//react
import React, { Component} from 'react';
import './App.css';

import {PmaCollectionManager} from './Pma/Component_pma.js'
import {PmaSelector} from './Pma/PmaSelector.js'
import {Login} from './Services/Login.js'
import {FooterKiabi} from './GUI/FooterKiabi.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTypePma: null,
    }
    // permet de changer de type de pma
    this.onSelection  = this.onSelection.bind(this)
    this.onLogged     = this.onLogged.bind(this)
  }

  onSelection(pmaType){
    this.pmaCollection.updatePmaType(pmaType)
  }

  onLogged(){
      console.log("client logged");
      this.forceUpdate()
  }

  render() {
    return (
      <body className="App">
        <header className="App-header">
          <p id="App-subheader">Kiabi pma Admin</p>
        </header>
        <main>
          <p className="App-intro"></p>
          <img src={require('./static/kiabi-logo.png')} alt="kiabilogo"/>
          <div style={{display:Login.isUserlogged() ? 'block' : 'none'}}>
            <PmaSelector
              onSelection = {this.onSelection}
            />
            <PmaCollectionManager
              ref = {(pmaCollection) => { this.pmaCollection = pmaCollection}}
            />
          </div>
          <div style={{display:Login.isUserlogged() ? 'none' : 'block', marginTop:"100px"}}>
            <Login
              onLogged={this.onLogged}
            />
          </div>
        </main>
        <footer className="page-footer" style={{ bottom:0, left:0, width:"100%"}}>
          <FooterKiabi/>
        </footer>
      </body>
    );
  }
}

export default App;
