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
        <div>
            <img src="smartphone_cat.png" alt="Mountain View" onClick={this.test}/>

            <a className="waves-effect waves-light btn" onClick={this.props.onSelection.bind(this, Pmatype1)}>button</a>
            <a className="waves-effect waves-light btn" onClick={this.props.onSelection.bind(this, Pmatype2)}><i className="material-icons left">cloud</i>button</a>
            <a className="waves-effect waves-light btn" onClick={this.props.onSelection.bind(this, "pma_2")}><i className="material-icons right">cloud</i>button</a>
        </div>
      );
    }
  }
