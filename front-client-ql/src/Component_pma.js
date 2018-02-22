import React, { Component} from 'react';
import ReactDOM from 'react-dom';

import Dropzone from  'react-dropzone';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

// gere les collection de pma
export class PmaCollectionManager extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pma: [],
    };
    this.appendNewPma = this.appendNewPma.bind(this);
    this.onDelete = this.onDelete.bind(this)
  }

  appendNewPma(){
    var newPma = this.state.pma.slice();
    newPma.push(PmaType1);
    this.setState({pma:newPma})
  }

  onDelete(idx){
    var pma = this.state.pma.slice();
    // note react a du mal a retirer un objet référencé dans le tableau.
    pma.shift()
  //  console.log("index---> ", this.refs['pma' + idx.toString()], mountNode);
    this.setState({pma:pma})
  }

  render() {
    return (
      <div id="scroller-wrapper">
        <div id="scroller">
          <a className="waves-effect waves-light btn" onClick={this.appendNewPma}>new</a>
          {this.state.pma.map((Item, index) => (
            <Item
              key       = {index}
              ref       = {"pma" + index.toString()}
              onDelete  = {() => this.onDelete(index)}
              title     = {index}/>
            ))}
        </div>
      </div>
    );
  }
}

// pma classique
export class PmaType1 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: 'default',
      imageFiles: [],
      startDate: moment(),
      endDate: moment()
    };
    this.handleChangeStart  = this.handleChangeStart.bind(this);
    this.handleChangeEnd    = this.handleChangeEnd.bind(this);
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
      startDate: date
    });
  }
  handleChangeEnd(enddate) {
    this.setState({
      endDate: enddate
    });
  }

   render() {
      return (
      <div className="row oneLine">
        <div className="col">
          <div className="card pma-card-block">
            <div className="card-image">
              <Dropzone
                  className       = "dragAndDropArea"
                  onDrop          = {this.onDrop.bind(this)}
                  accept          = "image/jpeg,image/jpg,image/tiff,image/gif,image/png"
                  multiple        = {false}
                  onDropRejected  = {this.handleDropRejected}>
                  <div>{this.state.imageFiles.map((file, idx) => <img className="dragAndDropArea" src={file.preview} key={'k' + idx}/> )}</div>
              </Dropzone>
            </div> {/* card-image */}
            <div className="card-content">
              <div className="input-field">
                <input spellCheck="false" value={this.props.title} onChange={(e) => this.setState({ title: e.target.value }) } id="input_000" type="text" className="validate"></input>
                <label className="active" htmlFor="first_name2">Titre</label>
              </div>
              <div className="input-field">
                <textarea id="textarea1v" spellCheck="false" className="materialize-textarea"></textarea>
                <label htmlFor="icon_prefix">Légende</label>
              </div>
              <DatePicker
                selected        = {this.state.startDate}
                selectsStart
                showTimeSelect
                startDate       = {this.state.startDate}
                endDate         = {this.state.endDate}
                onChange        = {this.handleChangeStart}
                timeFormat      = "HH:mm"
                timeIntervals   = {15}
                dateFormat      = "DD-MMM HH:mm"
              />
              <DatePicker
                selected        = {this.state.endDate}
                selectsEnd
                showTimeSelect
                startDate       = {this.state.startDate}
                endDate         = {this.state.endDate}
                onChange        = {this.handleChangeEnd}
                timeFormat      = "HH:mm"
                timeIntervals   = {15}
                dateFormat      = "DD-MMM HH:mm"
                />
            </div> {/* card-content */}
            <div className="card-action">
              <div className="row">
                 <div className="col s6">
                    <div className="switch">
                      <label>
                      <input type="checkbox"></input>
                      <span className="lever"></span>
                      </label>
                    </div>
                </div>
                <div className="col s6">
                  <a className="btn-floating btn-small waves-effect waves-light gray" onClick={this.props.onDelete} ><i className="material-icons">clear</i></a>
                </div> {/* col */}
              </div> {/* row */}
            </div> {/* card-action */}
          </div> {/* card-pmablock */}
        </div> {/* col */}
      </div>
      );
   }
}
