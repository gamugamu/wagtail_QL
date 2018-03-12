// permet de choisir son pma.
import React from 'react';
import {Pmatype1} from './PmaType1.js'
import {Pmatype2} from './PmaType2.js'


export const default_pma = {Pmatype1};

export class PmaSelector extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pma: [],
    }
  }

  test(){
    console.log("ok   +++");
  }

  render() {
      return (
        <div id="wrapped_home_selector" className="center-align" style={{marginTop:'50px'}}>
            <div id="tesst_0" className="center_selector hoverable" onClick={this.props.onSelection.bind(this, Pmatype1)}/>
            <div id="tesst_1" className="center_selector hoverable" onClick={this.props.onSelection.bind(this, Pmatype2)}/>
            <div id="tesst_2" className="center_selector hoverable" onClick={this.props.onSelection.bind(this, "pma_2")}/>
            <img src={require('../static/smartphone_cat.png')} alt="Mountain View" onClick={this.test}/>
        </div>
      );
    }
  }
