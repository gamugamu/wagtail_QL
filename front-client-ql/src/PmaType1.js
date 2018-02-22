import React, { Component} from 'react';
import Dropzone from  'react-dropzone';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {apollo_client} from './Service.js'
import gql from 'graphql-tag'

// pma classique
export class PmaType1 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      blob: {},
      title: '',
      imageFiles: [],
      dateStart: moment(),
      dateEnd: moment()
    };
    this.handleChangeStart  = this.handleChangeStart.bind(this);
    this.handleChangeEnd    = this.handleChangeEnd.bind(this);
  }

  static handleQuerieFindAllElmt(callback){
    apollo_client.query({ query: gql
      `{
          allPmahome{
            title
            caption
            id
            dateStart
            dateEnd
            category
          }
      }`}).then(({ data }) => {
          callback(data["allPmahome"])
      });
  }

  display(blob){
    console.log("__>", blob.caption);
    this.setState({
        title:      blob.title,
        caption:    blob.caption,
        dateStart:  moment(blob.dateStart),
        dateEnd:    moment(blob.dateEnd)
    })
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
    console.log("date", date.format('DD/MM/YYYY'));
    this.setState({
      dateStart: date
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: date
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
                <input spellCheck="false" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value }) } id="input_000" type="text" className="validate"></input>
                <label className="active" htmlFor="first_name2">Titre</label>
              </div>
              <div className="input-field">
                <textarea id="textarea1v" value={this.state.caption} spellCheck="false" className="materialize-textarea"></textarea>
                <label htmlFor="icon_prefix">Légende</label>
              </div>
              <DatePicker
                selected        = {this.state.dateStart}
                selectsStart
                showTimeSelect
                startDate       = {this.state.dateStart}
                endDate         = {this.state.dateEnd}
                onChange        = {this.handleChangeStart}
                timeFormat      = "HH:mm"
                timeIntervals   = {15}
                dateFormat      = "DD-MMM HH:mm"
              />
              <DatePicker
                selected        = {this.state.dateEnd}
                selectsEnd
                showTimeSelect
                startDate       = {this.state.dateStart}
                endDate         = {this.state.dateEnd}
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
