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

var _timelineItems = [{
  start:    new Date(2018, 1, 27),
  end:      new Date(2018, 1, 28),  // end is optional
  content: 'test',
  style:    "color: red; background-color: pink;"
}]

// gere les collection de pma
export class PmaCollectionManager extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pma: [],
      timelineItems: _timelineItems
    };
    this.appendNewPma     = this.appendNewPma.bind(this)
    this.onDelete         = this.onDelete.bind(this)
    this.renderTimeline   = this.renderTimeline.bind(this)

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

  onDateChange(state){
    this.renderTimeline(state.id, state.dateStart, state.dateEnd, state.title)
  }

  renderTimeline(tag, dateStart, dateEnd, eventName=""){
    var _timeLineItems = this.state.timelineItems.slice();

    if (tag !== null && this.state.timelineItems !== undefined){
      var timeLineIdx = -1;
      // Update the timeline. Finding the correcting idx either for update
      // or create a new period composant.
      for (var t in _timeLineItems){
        if(_timeLineItems[t]['tag'] === tag){
          timeLineIdx = t
          break;
        }
      }

      var timeLine = {
          start:    dateStart.toDate(),
          end:      dateEnd.toDate(),  // end is optional
          style:    "color: red; background-color: blue;",
          tag:      tag,
          content:  eventName
      }

      // null then create
      if (timeLineIdx === -1 || undefined){
          _timeLineItems.push(timeLine)
      }else{// not null, update
          _timeLineItems[timeLineIdx] = timeLine;
      }
    }

      this.setState({timelineItems: _timeLineItems});
  }

  render() {
    return (
      <div>
        <div id="scroller-wrapper">
          <div id="scroller">
            <a className="waves-effect waves-light btn" onClick={this.appendNewPma}>new</a>
            {this.state.pma.map((Item, index) => (
              <this.props.typePma
                key           = {index}
                pma           = {Item}
                onDelete      = {()       => this.onDelete(index)}
                onDateChange  = {(child)  => this.onDateChange(child)}
                />
              ))}
            </div>
          </div>
          <Timeline
            options   = {timelineOptions}
            items     = {this.state.timelineItems}/>
      </div>
    );
  }
}
