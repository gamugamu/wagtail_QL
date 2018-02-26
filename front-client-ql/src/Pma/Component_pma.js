import React from 'react';
import {TimelinePma} from '../GUI/TimelinePma.js'
import {Pmatype1} from './PmaType1.js'

// gere les collection de pma
export class PmaCollectionManager extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pma: [],
    };
    this.onAddPma       = this.onAddPma.bind(this)
    this.onDeletePma    = this.onDeletePma.bind(this)
    this.updatePmaType  = this.updatePmaType.bind(this)

    /*
    // display le nombre d'object de ce type
    var _this = this
    this.props.typePma.handleQuerieFindAllElmt(function(data){
      _this.setState({
          pma: data
      })
    })
    */
  }

  updatePmaType(pmaType){
    // display le nombre d'object de ce type
    var _this = this
    pmaType.handleQuerieFindAllElmt(function(data){
          _this.setState({
              typePma : pmaType,
              pma: data
          })
        })
  }

  onAddPma(){
    var newPma = this.state.pma.slice();
    newPma.push(this.state.typePma);
    this.setState({pma:newPma})
  }

  onDeletePma(idx){
    var pma = this.state.pma.slice();
    pma.shift()
    this.setState({pma:pma})
  }

  // timeLine support
  onDateChange(state){
    this.timeLine.renderTimeline(state.id, state.dateStart, state.dateEnd, state.title)
  }

  render() {
    return (
      <div>
        <div id="scroller-wrapper">
          <div id="scroller">
            <a className="waves-effect waves-light btn" onClick={this.onAddPma}>new</a>
            {this.state.pma.map((Item, index) => (
              <this.state.typePma
                key           = {index}
                pma           = {Item}
                onDelete      = {()       => this.onDeletePma(index)}
                onDateChange  = {(child)  => this.onDateChange(child)}
                />
              ))}
            </div>
          </div>
          <TimelinePma
            ref = {(timeLine) => { this.timeLine = timeLine; }}
          />
      </div>
    );
  }
}
