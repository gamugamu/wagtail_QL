import React from 'react';
import {apollo_client, uploadfile, configFor} from '../Services/Graph.js'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo';

import {GQLStringifier} from '../Services/GQLStringifier.js'
import {Pmatype1} from './PmaType1.js'
import Dropzone from  'react-dropzone';

class gallery {
  constructor() {
    this.imageFile        = []
    this.title            = ""
    this.caption          = ""
    this.urlImage         = ""
    this.urlRedirection   = ""
  }
}

const max_gallery = 6;

export class Pmatype2 extends Pmatype1{
  constructor(props) {
    super(props);
    this.state = {
      title: '',        /* parent parser error */
      isActive: false,  /* parent parser error */
      galleries: [new gallery()],
      currentIndexSelected: 0
    };

    this.onAddingNewGallery = this.onAddingNewGallery.bind(this);
  }

  // query display
  static handleQuerieFindAllElmt(callback){
      var axios   = require('axios')
      let configJson = {
        url: configFor('url_servicePma_graphql'),
        method: 'post',
        data: {
          query: `query gallery{
            allPmaGallery{
                id
                title
                caption
                isActive
                dateStart
                dateEnd
                gallery{
                    title
                    caption
                    urlImage
                    urlRedirection
                }
              }
          }`
        }
    };
    // swap bewteen configGraphQL and configJson (same response)
    axios(configJson).then(response => {
        callback(response.data.data["allPmaGallery"])
    }).catch(err => {
      console.log('graphql error:', err);
    });
  }

  // query display
  static addNewElmt(callback){
    var axios   = require('axios')
    let configJson = {
      url: configFor('url_servicePma_graphql'),
      method: 'post',
      data: {
        query: `mutation myMutation {
                  mutatePmaGallery(pmaData: {gallery: [{}]}) {
                    pma {
                      id
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

  // update
  mutateFromActualState(){
      var axios   = require('axios');
      var gallery =  GQLStringifier.stringify(this.state.galleries, ["imageFile"])
      // application/json example
      /* eslint-disable no-unused-vars */
      var id = (typeof this.state.id !== 'undefined')? this.state.id : 100

      let configJson = {
      	url: configFor('url_servicePma_graphql'),
      	method: 'post',
      	data: {
      		query: `mutation m {
            mutatePmaGallery(pmaData: {
              id:` + id + `
              title:    ${JSON.stringify(this.state.title)},
              caption:  ${JSON.stringify(this.state.caption)},
              isActive: ${JSON.stringify(this.state.isActive)},
              gallery:  ${gallery}}) {
              pma{
                title,
                caption,
                gallery{
                  title
                }
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

// delete
willDelete(){
  var axios       = require('axios');
  let configJson  = {
    url: configFor('url_servicePma_graphql'),
    method: 'post',
    data: {
      query: `mutation m {
        deletePmaGallery(id:${this.state.id}){
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
    super.display(blob)
    var listGallery = [new gallery()]
    // note: pas testé
    for(var gIdx in blob.gallery){
      var gallery_  = blob.gallery[gIdx]
      var g         = new gallery();

      for (const [key, value] of Object.entries(gallery_)) {
          g[key] = value
      }
      listGallery[gIdx] = g
    }

    this.setState({
        galleries: listGallery
    })
  }

  // image callback
  onDrop(idx, imageFiles){
    var cp_galleries              = this.state.galleries.slice()
    cp_galleries[idx].imageFile   = imageFiles

    var _this = this;

    uploadfile(cp_galleries[idx].imageFile[0], function(url, error){
      cp_galleries[idx].urlImage = url

      _this.setState({
          galleries: cp_galleries
      })
    });
  }

  url_image_forIndex(idx){
    return this.state.galleries[idx].urlImage
  }

  class_for_state(idx){
    return (idx == this.state.currentIndexSelected)? "active red" : ""
  }

  onAddingNewGallery(){
    console.log("fe",this.state.galleries.length, max_gallery);
    if(this.state.galleries.length < max_gallery){
      var g = this.state.galleries.slice()
      g.push(new gallery())
      var idx = g.length - 1

      this.setState({
        galleries: g,
        currentIndexSelected: idx
      })
    }
  }

  onDeletingGallery(idx){
    if(idx >= 1){
      var g = this.state.galleries.slice()
      g.splice(idx, 1)
      idx--

      this.setState({
        galleries: g,
        currentIndexSelected: idx
      })
    }
  }

  onGalleryPageChange(idx){
    this.setState({
      currentIndexSelected: idx
    })
  }

  update_render(idx, key, value){
    var gallery       = this.state.galleries[idx]
    gallery[key]      = value;
    var cp_galleries  = this.state.galleries.slice()
    cp_galleries[idx] = gallery

    this.setState({
        galleries: cp_galleries
    })
  }

  render() {
     return (
     <div className="row oneLine">
       <div className="col">
         <div className="card pma-card-block">
             <div className="gallery-content">
                {this.r_gallery(this.state.currentIndexSelected)}
                {this.r_cardImage(this.state.currentIndexSelected, this.url_image_forIndex(this.state.currentIndexSelected))}
                {this.r_title(this.state.currentIndexSelected, "title", this.state.galleries[this.state.currentIndexSelected].title)}
                {this.r_caption(this.state.currentIndexSelected, "caption", this.state.galleries[this.state.currentIndexSelected].caption)}
             </div> {/* gallery-content */}
           <div className="card-content">
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
  // réimplementation des méthodes
  r_title = (idx, key, value) => {
    return(
      <div className="input-field">
        <input spellCheck="false" value={value} onChange={(e) => this.update_render(idx, key, e.target.value)} id="input_000" type="text" className="validate"></input>
        <label className="active">Titre</label>
      </div>
    )
  }

  r_gallery = (idx, key, value) => {
    return(
      <div class="row paginationBkg valign-wrapper">
      <div class="col s3">
        <a className="left btn_add btn red z-depth-0" onClick={(e) => this.onAddingNewGallery()}>
          <i className="large material-icons">add</i>
        </a>
      </div>
      <div class="col s6">
        <ul className="left pagination ">
          <div className=" paginationumber blue-text">
            {this.state.galleries.map((gallery, idx) =>
              <li key={"g" + idx} className={this.class_for_state(idx)}><a className="white-text" onClick={(e) => this.onGalleryPageChange(idx)}>{idx + 1}</a></li>
            )}
          </div>
        </ul>
      </div>
      <div class="col s3">
        <a className="btn z-depth-0" onClick={(e) => this.onDeletingGallery(idx)}>
          <i className="material-icons">clear</i>
        </a>
      </div>
    </div>
    )
  }

  r_caption = (idx, key, value) => {
    return(
      <div className="input-field">
        <textarea id="textarea1v" value={value} onChange={(e) => this.update_render(idx, key, e.target.value)} spellCheck="false" className="materialize-textarea"></textarea>
        <label className="active">Légende</label>
      </div>
    )
  }

  r_cardImage = (idx, source) => {
    return(
        <div className="card-image">
          <Dropzone
              className       = "dragAndDropArea"
              onDrop          = {this.onDrop.bind(this, idx)}
              accept          = "image/jpeg,image/jpg,image/tiff,image/gif,image/png"
              multiple        = {false}
              onDropRejected  = {this.handleDropRejected}>
              <img className="dragAndDropArea" src={source} key={'k' + idx} alt=""/>
          </Dropzone>
        </div>
    )
  }
}
