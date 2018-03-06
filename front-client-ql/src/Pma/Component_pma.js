import React from 'react';
import {TimelinePma} from '../GUI/TimelinePma.js'

// gere les collection de pma
export class PmaCollectionManager extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pma: []
    };
    this.onAddPma       = this.onAddPma.bind(this)
    this.updatePmaType  = this.updatePmaType.bind(this)
    this.redisplay      = this.redisplay.bind(this)
  }

  updatePmaType(pmaType){
    // display le nombre d'object de ce type
    // clean
    var _this = this
    // update
    pmaType.handleQuerieFindAllElmt(function(data){
      // Note: Reactjs est très débile.
      console.log("handleQuerieFindAllElmt update----");
      _this.setState({
          pma: []
      })
      _this.setState({
          typePma : pmaType,
          pma: data
      })
    })
  }

  redisplay(){
    // display le nombre d'object de ce type
    console.log("----- redisplay");
    this.updatePmaType(this.state.typePma)
  }

  onAddPma(){
    var _this = this
    this.state.typePma.addNewElmt(function(data){
        _this.redisplay()
    })
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
                onDateChange  = {(child)  => this.onDateChange(child)}
                redisplay     = {()       => this.redisplay()}
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
