import React from 'react';
import ReactDOM from 'react-dom';
import Timeline from 'react-visjs-timeline'
import moment from 'moment';

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
    //  this.setState({timelineItems: timeLineItems});

    if (tag !== null && this.state.timelineItems !== undefined){
      var timeLineIdx = -1;
      // check for update. We're just finding the correcting idx either for update
      // or ccreate a new composant.
      for (var t in _timeLineItems){
        console.log("compare tag", tag, _timeLineItems[t]['tag'] );
        if(_timeLineItems[t]['tag'] === tag){
          timeLineIdx = _timeLineItems[t]['idx']
          break;
        }
      }

      dateStart = moment(dateStart.format())
      dateEnd   = moment(dateEnd.format())

      var timeLine = {
          start:    dateStart.toDate(),
          end:      dateEnd.toDate(),  // end is optional
          style:    "color: red; background-color: blue;",
          tag:      tag,
          content:  eventName
      }

      // null then create
      if (timeLineIdx === -1 || undefined){
        console.log("++++ pushed");
          _timeLineItems.push(timeLine)
      }else{// not null, so update in the corresponding index
        console.log("++++ from index", dateStart.format(), timeLine);
          _timeLineItems[timeLineIdx] = timeLine;
      }
    } /* if tag != 0 */

    //  console.log("perform UPDATE start: ", dateStart.format(), "end: ", dateEnd.format());
    //  var timeLineItems = this.state.timelineItems.slice();
    //  timeLineItems.push(timeLine)
        console.log("items", _timeLineItems);
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
