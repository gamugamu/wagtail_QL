import React from 'react';
import {TimelinePma} from '../GUI/TimelinePma.js'
import {Scroller} from '../GUI/Scroller.js'
// gere les collection de pma
export class PmaCollectionManager extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pma: [],
      currentPmaType: undefined,
      shouldHide: true
    };
    this.onAddPma       = this.onAddPma.bind(this)
    this.updatePmaType  = this.updatePmaType.bind(this)
    this.redisplay      = this.redisplay.bind(this)
    this.scroller       = new Scroller()
  }

  updatePmaType(pmaType){
    // display le nombre d'object de ce type
    // clean
    var _this = this
    this.setState({
      currentPmaType: "pmaType",
      shouldHide: false
    })

    // update
    pmaType.handleQuerieFindAllElmt(function(data){
      // Note: Reactjs est très débile.
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

  hideFromState(shouldHide, string, comp_0, comp_1){
    var state = shouldHide? comp_0 : comp_1
    return string + state
  }

  isActive(){
    return (this.state.currentPmaType !== undefined)
  }

  render() {
    if (!this.state.shouldHide) {
        return (
          <div>
            <a className="btnaddgallery hoverable btn-floating waves-effect waves-light">
                <img src={require('../static/gall-add.png')} alt="add" onClick={this.onAddPma}/>
            </a>
            <div className="noselect" id="scroller-wrapper" onScroll={this.handleScroll}>
              <div id="scroller" ref="scroller"
                onMouseUp     = {((e) => this.scroller.onMouseUp(e, this.refs.scroller))}
                onMouseDown   = {((e) => this.scroller.onMouseDown(e, this.refs.scroller))}
                onMouseMove   = {((e) => this.scroller.onMouseMove(e, this.refs.scroller))}
                onMouseLeave  = {((e) => this.scroller.onMouseLeave(e, this.refs.scroller))}>
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
            <div className= "timeLine_on">
              <TimelinePma
                ref       = {(timeLine) => { this.timeLine = timeLine }}
                isActive  = {true}
              />
            </div>
          </div>
        );
    } // if
    else{
      return <div></div>
    }
  }
}
