import React from 'react';
import Dropzone from  'react-dropzone';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {apollo_client, uploadfile} from '../Services/Graph.js'
import gql from 'graphql-tag'
import _ from 'underscore'


// pma classique
export class Pmatype1 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      id: 0,
      imageFiles: [],
      imageCmpFiles: [],
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
    console.log("handleQuerieFindAllElmt+++");
    apollo_client.query({ query: gql`
      {allPmahome{
            id
            title
            caption
            isActive
            dateStart
            dateEnd
            category
            urlPmaImage
          }
      }`}).then(({ data }) => {
          callback(data["allPmahome"])
      });
  }

// query mutate
  mutateFromActualState(){
    var _this = this
    if(!_.isEqual(this.state.imageFiles, this.state.imageCmpFiles)){
      //TODO! pas safe et asynchrone + FOR boucle
      uploadfile(this.state.imageFiles[0], function(url, error){
        // note: Js ne sais pas décorer des fonctions.
        makeMutation(_this, url)
      });
    }else{
      makeMutation(this)
    }

    function makeMutation(_this, urlImage = null){
      console.log("mutate", _this.state.dateStart.format());

      apollo_client.mutate({mutation: gql`
        mutation mutation(
          $title: String!, $caption: String!, $id: Int!, $dateStart: String!,
          $dateEnd: String!, $isActive: Boolean!, $urlPmaImage: String){
            mutatePmaHome(pmaData:
              {id:$id, title: $title, caption: $caption, dateStart: $dateStart,
                dateEnd: $dateEnd, isActive: $isActive, urlPmaImage: $urlPmaImage}) {
                pma{
                  id
                }
              }
            }`,
          variables: {
            title:      _this.state.title,
            caption:    _this.state.caption,
            id:         _this.state.id,
            isActive:   _this.state.isActive,
            dateStart:  _this.state.dateStart.format(),
            dateEnd:    _this.state.dateEnd.format(),
            urlPmaImage: urlImage
          },
        }).then(({ data }) => {
            console.log("*done", data );
        });;
    }
  }

// display
  display(blob){
    this.setState({
        id:             blob.id,
        title:          blob.title,
        caption:        blob.caption,
        isActive:       blob.isActive,
        dateStart:      this.helper_date(moment(blob.dateStart)),
        dateEnd:        this.helper_date(moment(blob.dateEnd)),
        imageFiles:     [{"preview" : blob.urlPmaImage}],
        imageCmpFiles:  [{"preview" : blob.urlPmaImage}],
    })
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
            <div className="card-image">
              <Dropzone
                  className       = "dragAndDropArea"
                  onDrop          = {this.onDrop.bind(this)}
                  accept          = "image/jpeg,image/jpg,image/tiff,image/gif,image/png"
                  multiple        = {false}
                  onDropRejected  = {this.handleDropRejected}>
                  <div>{this.state.imageFiles.map((file, idx) => <img className="dragAndDropArea" src={file.preview} key={'k' + idx} alt=""/> )}</div>
              </Dropzone>
            </div> {/* card-image */}
            <div className="card-content">
              <div className="input-field">
                <input spellCheck="false" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value }) } id="input_000" type="text" className="validate"></input>
                <label className="active" htmlFor="first_name2">Titre</label>
              </div>
              <div className="input-field">
                <textarea id="textarea1v" value={this.state.caption} onChange={(e) => this.setState({ caption: e.target.value }) } spellCheck="false" className="materialize-textarea"></textarea>
                <label className="active" htmlFor="icon_prefix">Légende</label>
              </div>
              <div className ="row">
                <div className ="col s1">
                    <i className="fas fa-clock date-picto start"></i>
                </div>{/* column */}
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
                </div>{/* column */}
                <div className ="col s1">
                  <i className="fas fa-clock date-picto end"></i>
                </div>{/* column */}
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
                  </div>{/* column */}
                </div>{/* row */}
            </div> {/* card-content */}
            <div className="card-action blue-grey darken-1">
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
                    </div> {/* col */}
                    <div className="col s6">
                      <a className="no-depth-float btn-floating btn-small waves-effect waves-light gray" onClick={this.mutateFromActualState} ><i className="material-icons">check</i></a>
                    </div> {/* col */}
                  </div> {/* row */}
                </div> {/* col */}
              </div> {/* row */}
            </div> {/* card-action */}
          </div> {/* card-pmablock */}
        </div> {/* col */}
      </div>
      );
   }
}

export class Pmatype2 extends Pmatype1{
  render() {
     return (
     <div className="row oneLine">
       <div className="col">
         <div className="card pma-card-block">
           <div className="card-content">
             <div className="input-field">
               <input spellCheck="false" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value }) } id="input_000" type="text" className="validate"></input>
               <label className="active" htmlFor="first_name2">Titre</label>
             </div>
             <div className="input-field">
               <textarea id="textarea1v" value={this.state.caption} onChange={(e) => this.setState({ caption: e.target.value }) } spellCheck="false" className="materialize-textarea"></textarea>
               <label htmlFor="icon_prefix">Légende</label>
             </div>
             <div className ="row">
               <div className ="col s1">
                   <i className="fas fa-clock date-picto start"></i>
               </div>{/* column */}
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
               </div>{/* column */}
               <div className ="col s1">
                 <i className="fas fa-clock date-picto end"></i>
               </div>{/* column */}
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
                 </div>{/* column */}
               </div>{/* row */}
           </div> {/* card-content */}
           <div className="card-action blue-grey darken-1">
             <div className="row">
                <div className="col s6">
                 <div className="switch">
                    <label>
                    <input type="checkbox" checked={this.state.isActive} onChange={(e) => this.setState({ isActive: !this.state.isActive }) }></input>
                    <span className="lever"></span>
                    </label>
                 </div>
               </div>
               <div className="col s6">
                 <div className="row">
                   <div className="col s6">
                     <a className="no-depth-float btn-floating btn-small waves-effect waves-light gray" onClick={this.props.onDelete} ><i className="material-icons">clear</i></a>
                   </div> {/* col */}
                   <div className="col s6">
                     <a className="no-depth-float btn-floating btn-small waves-effect waves-light gray" onClick={this.mutateFromActualState} ><i className="fas fa-check-circle"></i></a>
                   </div> {/* col */}
                 </div> {/* row */}
               </div> {/* col */}
             </div> {/* row */}
           </div> {/* card-action */}
         </div> {/* card-pmablock */}
       </div> {/* col */}
     </div>
   )
 }
}
