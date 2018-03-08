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

export class TimelinePma extends React.Component{
  constructor(props) {
    super(props);
    var dateNow = new Date(1);
    this.state = {
      timelineItems: [{
        // Note: Bien qu'inutile, si on n'instancie pas le timeline avec un object,
        // il se retrouve vide et impossible à changer.
        start:    dateNow,
        end:      dateNow,  // end is optional
      }] // tableau vide ne fonctionne pas
    };
    this.renderTimeline   = this.renderTimeline.bind(this)
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
            <Timeline
              options   = {timelineOptions}
              items     = {this.state.timelineItems}/>
          </div>

    );
  }

}
