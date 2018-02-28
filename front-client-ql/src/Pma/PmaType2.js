import React from 'react';
import {apollo_client} from '../Services/Graph.js'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo';

import {GQLStringifier} from '../Services/GQLStringifier.js'
import {Pmatype1} from './PmaType1.js'
import Dropzone from  'react-dropzone';


class gallery {
  constructor() {
    this.name             = ""
    this.imageFile        = []
    this.title            = ""
    this.caption          = ""
    this.url_redirection  = ""
  }


}

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
    apollo_client.query({ query: gql`
      {
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
      }`}).then(({ data }) => {
          callback(data["allPmaGallery"])
      });
  }


  mutateFromActualState(){
    var axios = require('axios');
    console.log("GALLERIES -->", GQLStringifier.stringify(this.state.galleries[0], [], ["title"]));
    var gallery =  GQLStringifier.stringify(this.state.galleries, [], ["title"])

    console.log("RESUKT -->", gallery);
    
    // application/json example
  /* eslint-disable no-unused-vars */
  let configJson = {
  	url: 'http://127.0.0.1:5000/graphql',
  	method: 'post',
  	data: {
  		query: `mutation myMutation {
        mutatePmaGallery(pmaData: {title: "new pma from js", caption: "lobulous", gallery:${gallery} }) {
          pma{
            title
            caption
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
    return;

    apollo_client.mutate({mutation: gql`
      mutation mutation(
        $title: String!, $caption: String!, $id: Int!, $dateStart: String!,
        $dateEnd: String!, $isActive: Boolean!, $urlPmaImage: String, $gallery:[Gallery]){
          mutatePmaGallery(pmaData:
            {id:$id, title: $title, caption: $caption, dateStart: $dateStart,
              dateEnd: $dateEnd, isActive: $isActive, urlPmaImage: $urlPmaImage, gallery: $gallery}) {
              pma{
                id
              }
            }
          }
          `,
        variables: {
          title:      this.state.title,
          caption:    this.state.caption,
          id:         this.state.id,
          isActive:   this.state.isActive,
          dateStart:  this.state.dateStart.format(),
          dateEnd:    this.state.dateEnd.format(),
          gallery:    this.state.gallery
        },
      }).then(({ data }) => {
          console.log("*done", data );
      });
    }

// display
  display(blob){
    super.display(blob)
    var listGallery = []
    // note: pas testé
    for(var gallery_ in blob.gallery){
      gallery_  = blob.gallery[gallery_]
      var g     = new gallery();

      for (const [key, value] of Object.entries(gallery_)) {
          g[key] = value
      }
      listGallery.push(g)
    }

    this.setState({
        galleries: listGallery
    })
  }

  // image callback
  onDrop(idx, imageFiles){
    var cp_galleries              = this.state.galleries.slice()
    cp_galleries[idx].imageFile   = imageFiles

    this.setState({
        galleries: cp_galleries
    })
  }

  url_image_forIndex(idx){
    if(this.state.galleries[idx].imageFile.length !== 0){
      return this.state.galleries[idx].imageFile[0]['preview']
    }else{
      return ""
    }
  }

  class_for_state(idx){
    return (idx == this.state.currentIndexSelected)? "active" : "waves-effect"
  }

  onAddingNewGallery(){
    var gallery = this.state.galleries.slice()
    gallery.push(new gallery())

    this.setState({
      galleries: gallery
    })

    console.log("this ", this.state.galleries);
  }

  onGalleryPageChange(idx){
    console.log("onGalleryPageChange ", idx);

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

  updateDispayForIdx(){

  }

  render() {
     return (
     <div className="row oneLine">
       <div className="col">
         <div className="card pma-card-block">
             <div>
                <a className="btn-floating btn-small waves-effect waves-light red" onClick={(e) => this.onAddingNewGallery()}>
                  <i className="material-icons">add</i>
                </a>
                <ul className="pagination">
                <div>
                {this.state.galleries.map((gallery, idx) =>
                  <li key={"g" + idx} className={this.class_for_state(idx)}><a href="#!" onClick={(e) => this.onGalleryPageChange(idx)}>{idx + 1}</a></li>
                )}
                </div>
                </ul>
             </div>
             <div className="gallery-content">
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
              <div>
                <img className="dragAndDropArea" src={source} key={'k' + idx} alt=""/>
              </div>
          </Dropzone>
        </div>
    )
  }
}
