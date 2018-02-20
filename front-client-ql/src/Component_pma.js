import React, { Component } from 'react';
import Dropzone from  'react-dropzone';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

export class PmaType0 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      image: '',

    };
  }

   render() {
      return (
         <div className="container z-depth-1 row pma-card-block">
            <ul className="collection">
              <li className="collection-item">
                <div className="input-field">
                  <input spellCheck="false" onChange={(e) => this.setState({ title: e.target.value }) } id="input_000" type="text" className="validate"></input>
                  <label className="active" htmlFor="first_name2">Titre</label>
                </div>
              </li>
              <li className="collection-item">
              <div className="input-field">
                <textarea id="textarea1v" spellCheck="false" className="materialize-textarea"></textarea>
                <label htmlFor="icon_prefix">Légende</label>
              </div>
              </li>
              <li className="collection-item">
                <form action="#">
                  <div className="file-field input-field">
                    <div className="btn">
                      <span>File</span>
                      <input type="file" onChange={(e) => this.setState({ image : e.target.files }) }></input>
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text"></input>
                    </div>
                  </div>
                  </form>
              </li>
              <li className="collection-item">
                <a className="btn-floating btn-large waves-effect waves-light red" onClick={() => this.props.onValidate()} >
                  <i className="material-icons">add</i>
                </a>
              </li>
            </ul>
          </div>
      );
   }
}


export class PmaType1 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: '',
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
      <div className="row">
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
                <input spellCheck="false" onChange={(e) => this.setState({ title: e.target.value }) } id="input_000" type="text" className="validate"></input>
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
                  <a className="btn-floating btn-large waves-effect waves-light red">
                    save
                  </a>
                </div> {/* col */}
              </div> {/* row */}
            </div> {/* card-action */}
          </div> {/* card-pmablock */}
        </div> {/* col */}
      </div> 
      );
   }
}
