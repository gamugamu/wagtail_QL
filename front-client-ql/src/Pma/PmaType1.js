import React from 'react';
import {apollo_client, uploadfile, configFor} from '../Services/Graph.js'
import gql from 'graphql-tag'
import _ from 'underscore'
import moment from 'moment';
import {PmaBase} from './PmaBase.js'
import Dropzone from  'react-dropzone';

// pma classique
export class Pmatype1 extends PmaBase{
  constructor(props) {
    super(props);
    this.state = {
      title: '',        /* parent parser error */
      isActive: false,  /* parent parser error */
      imageFiles: [],
      imageCmpFiles: [],
      urlImage: "",
      urlRedirection: ""
    };
  }

// query display
static handleQuerieFindAllElmt(callback){
    var axios   = require('axios')
    let configJson = {
      url: configFor('url_servicePma_graphql'),
      method: 'post',
      data: {
        query: `query gallery{
          allPmaHome{
            id
            title
            caption
            isActive
            dateStart
            dateEnd
            category
            urlImage
            }
        }`
      }
  };
  // swap bewteen configGraphQL and configJson (same response)
  axios(configJson).then(response => {
      callback(response.data.data["allPmaHome"])
  }).catch(err => {
    console.log('graphql error:', err);
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
      makeMutation(_this)
    }

    function makeMutation(_this, urlImage = ""){
      var axios   = require('axios');
      // application/json example
      /* eslint-disable no-unused-vars */
      let configJson = {
        url: 'http://127.0.0.1:5000/graphql',
        method: 'post',
        data: {
          query: `mutation myMutation {
            mutatePmaHome(pmaData: {
              id:             ${this.state.id},
              title:          ${JSON.stringify(this.state.title)},
              caption:        ${JSON.stringify(this.state.caption)},
              urlImage:       ${JSON.stringify(urlImage)}}),
              urlRedirection: ${JSON.stringify(this.state.urlRedirection)} {
              pma{
                title,
              }
            }
          }`
        }
    };
    // swap bewteen configGraphQL and configJson (same response)
    axios(configJson).then(response => {
      console.log('graphql response:', response.data);
    }).catch(err => {
      console.log('graphql error:', err);
    });
    }
  }

  // query display
  static addNewElmt(callback){
    var axios   = require('axios')
    let configJson = {
      url: configFor('url_servicePma_graphql'),
      method: 'post',
      data: {
        query: `mutation pmaHome {
                  mutatePmaHome(pmaData: {title: "", caption: ""}) {
                    pma {
                      title
                      caption
                    }
                  }
                }`
      }
    };
    // swap bewteen configGraphQL and configJson (same response)
    axios(configJson).then(response => {
      callback(response.data.data["pma"])
    }).catch(err => {
      console.log('graphql error:', err);
    });
  }

  // delete
  willDelete(){
    var axios       = require('axios');
    let configJson  = {
      url: configFor('url_servicePma_graphql'),
      method: 'post',
      data: {
        query: `mutation m {
          deletePmaHome(id:${this.state.id}){
            state
          }
        }`
      }
    };
    // swap bewteen configGraphQL and configJson (same response)
    axios(configJson).then(response => {
      console.log('graphql response:', response.data);
    }).catch(err => {
      console.log('graphql error:', err);
    });

    super.willDelete()
  }

// display
  display(blob){
    if(typeof  blob !== 'function'){
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
    }else{
      this.setState({
          dateStart:      this.helper_date(moment(blob.dateStart)),
          dateEnd:        this.helper_date(moment(blob.dateEnd))
      })
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
