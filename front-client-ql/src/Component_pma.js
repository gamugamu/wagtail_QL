import React from 'react';
import Timeline from 'react-visjs-timeline'

const timelineOptions = {
  width:            '100%',
  height:           '100px',
  stack:            false,
  showMajorLabels:  true,
  showCurrentTime:  true,
  zoomMin:          1000000,
  type:             'background',
  format: {
    minorLabels: {
      minute: 'h:mma',
      hour:   'ha'
    }
  }
};

const timelineItems = [{
  start:    new Date(2018, 1, 27),
  end:      new Date(2018, 2, 28),  // end is optional
  content: 'evenement',
  style:    "color: red; background-color: pink;"
}]

// gere les collection de pma
export class PmaCollectionManager extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pma: [],
      queries: ''
    };
    this.appendNewPma = this.appendNewPma.bind(this);
    this.onDelete     = this.onDelete.bind(this)
    // display le nombre d'object de ce type
    var _this = this
    this.props.typePma.handleQuerieFindAllElmt(function(data){
      _this.setState({
          pma: data
      })
    })
  }

  appendNewPma(){
    var newPma = this.state.pma.slice();
    newPma.push(this.props.typePma);
    this.setState({pma:newPma})
  }

  onDelete(idx){
    var pma = this.state.pma.slice();
    pma.shift()
    //  console.log("index---> ", this.refs['pma' + idx.toString()], mountNode);
    this.setState({pma:pma})
  }

  render() {
    return (
      <div>
        <div id="scroller-wrapper">
          <div id="scroller">
            <a className="waves-effect waves-light btn" onClick={this.appendNewPma}>new</a>
            {this.state.pma.map((Item, index) => (
              <this.props.typePma
                key       = {index}
                ref       = {(child) => { child.display(Item)}}
                onDelete  = {() => this.onDelete(index)}
                />
              ))}
            </div>
          </div>
        <Timeline options={timelineOptions} items={timelineItems}/>
      </div>
    );
  }
}
