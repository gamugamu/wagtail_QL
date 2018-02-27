import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

// pma Base. Tout les pma héritent de pmaBase
export class PmaBase extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      id: 0,
      isActive: false,
      dateStart: moment(),
      dateEnd: moment()
    };
    this.handleChangeStart      = this.handleChangeStart.bind(this);
    this.handleChangeEnd        = this.handleChangeEnd.bind(this);
    this.mutateFromActualState  = this.mutateFromActualState.bind(this);
  }

  componentDidMount(){
    this.display(this.props.pma)
    // l'update ne peut pas se faire de manière asynchrone. Le timer n'est pas encore crée.
    setTimeout(function() {
      this.props.onDateChange(this.state, /*performUpdate*/ true)
    }.bind(this), 100);
  }

// query display
  static handleQuerieFindAllElmt(callback){
      // template
  }

// query mutate
  mutateFromActualState(){
      // template
  }

// display
  display(blob){
    // template
  }

  helper_date(date_){
    if(!date_.isValid()){
      return moment()
    }else{
      return date_
    }
  }
  // image callback
  onDrop(imageFiles){
    this.setState({
        imageFiles: imageFiles
    })
  }

  handleDropRejected(){
    //no op
  }

  // date callback
  handleChangeStart(date) {
    this.setState({
      dateStart: date
    });
    // setState est asynchronuous
    setTimeout(function() {
      this.props.onDateChange(this.state, /*performUpdate*/ true)
    }.bind(this), 100);
  }

  handleChangeEnd(date) {
    this.setState({
      dateEnd: date
    });
    // setState est asynchronuous
    setTimeout(function() {
      this.props.onDateChange(this.state, /*performUpdate*/ true)
    }.bind(this), 100);
  }

  render() {
     return (
     <div className="row oneLine">
       <div className="col">
         <div className="card pma-card-block">
           <div className="card-content">
             {this.r_title()}
             {this.r_caption()}
             {this.r_date()}
           </div> {/* card-content */}
           <div className="card-action blue-grey darken-1">
             {this.r_footerAction()}
           </div> {/* card-action */}
         </div> {/* card-pmablock */}
       </div> {/* col */}
     </div>
     );
  }

  // render Helper
  /////////////////////////////////////////////////////
  r_title = () => {
    return(
      <div className="input-field">
        <input spellCheck="false" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value }) } id="input_000" type="text" className="validate"></input>
        <label className="active">Titre</label>
      </div>
    )
  }

  r_caption = () => {
    return(
      <div className="input-field">
        <textarea id="textarea1v" value={this.state.caption} onChange={(e) => this.setState({ caption: e.target.value }) } spellCheck="false" className="materialize-textarea"></textarea>
        <label className="active">Légende</label>
      </div>
    )
  }

  r_date =  () => {
    return(
      <div className ="row">
        <div className ="col s1">
            <i className="fas fa-clock date-picto start"></i>
        </div>
        <div className ="col s5">
              <DatePicker
                selected        = {this.state.dateStart}
                selectsStart
                showTimeSelect
                startDate       = {this.state.dateStart}
                onChange        = {this.handleChangeStart}
                timeFormat      = "HH:mm"
                timeIntervals   = {15}
                dateFormat      = "DD-MMM HH:mm"
              />
        </div>
        <div className ="col s1">
          <i className="fas fa-clock date-picto end"></i>
        </div>
        <div className ="col s5">
          <DatePicker
            selected        = {this.state.dateEnd}
            selectsEnd
            showTimeSelect
            endDate         = {this.state.dateEnd}
            onChange        = {this.handleChangeEnd}
            timeFormat      = "HH:mm"
            timeIntervals   = {15}
            dateFormat      = "DD-MMM HH:mm"
            />
          </div>
        </div>
    )
  }

  r_footerAction = () => {
    return (
      <div className="row">
         <div className="col s6">
          <div className="switch">
             <label>
             Off
             <input type="checkbox" checked={this.state.isActive} onChange={(e) => this.setState({ isActive: !this.state.isActive }) }></input>
             <span className="lever"></span>
             On
             </label>
          </div>
        </div>
        <div className="col s6">
          <div className="row">
            <div className="col s6">
              <a className="no-depth-float btn-floating btn-small waves-effect waves-light gray" onClick={this.props.onDelete} ><i className="material-icons">clear</i></a>
            </div>
            <div className="col s6">
              <a className="no-depth-float btn-floating btn-small waves-effect waves-light gray" onClick={this.mutateFromActualState} ><i className="material-icons">check</i></a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
