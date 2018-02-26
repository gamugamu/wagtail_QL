import React from 'react';
import {apollo_client, uploadfile} from '../Services/Graph.js'
import gql from 'graphql-tag'
import _ from 'underscore'
import moment from 'moment';
import {PmaBase} from './PmaBase.js'
import Dropzone from  'react-dropzone';
import update from 'react-addons-update'; // ES6

// pma classique
export class Pmatype1 extends PmaBase{
  constructor(props) {
    super(props);
    this.state = {
      title: '',        /* parent parser error */
      isActive: false,  /* parent parser error */
      imageFiles: [],
      imageCmpFiles: []
    };
  }

// query display
  static handleQuerieFindAllElmt(callback){
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
      // aux enfant de gérer le tableau. Par deefault, une simple image.
      uploadfile(this.state.imageFiles[0], function(url, error){
        makeMutation(_this, url)
      });
    }else{
      makeMutation(this)
    }

    function makeMutation(_this, urlImage = null){
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

  // image callback
  onDrop(imageFiles){
    this.setState({
        imageFiles: imageFiles
    })
  }

  handleDropRejected(){
    //no op
  }

   render() {
      return (
      <div className="row oneLine">
        <div className="col">
          <div className="card pma-card-block">
              {this.r_cardImage()}
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
   r_cardImage = () => {
     return(
         <div className="card-image">
           <Dropzone
               className       = "dragAndDropArea"
               onDrop          = {this.onDrop.bind(this)}
               accept          = "image/jpeg,image/jpg,image/tiff,image/gif,image/png"
               multiple        = {false}
               onDropRejected  = {this.handleDropRejected}>
               <div>{this.state.imageFiles.map((file, idx) => <img className="dragAndDropArea" src={file.preview} key={'k' + idx} alt=""/> )}</div>
           </Dropzone>
         </div>
     )
   }
}
