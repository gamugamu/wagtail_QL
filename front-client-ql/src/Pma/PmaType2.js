import React from 'react';
import {apollo_client} from '../Services/Graph.js'
import gql from 'graphql-tag'
import {Pmatype1} from './PmaType1.js'
import Dropzone from  'react-dropzone';

class galleryStruct {
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
      galleries: [new galleryStruct()],
      imageFiles: [],
      imageCmpFiles: [],
      currentIndexSelected: 0
    };

    this.onAddingNewGallery = this.onAddingNewGallery.bind(this);
  }

  // query display
  static handleQuerieFindAllElmt(callback){
    apollo_client.query({ query: gql`
      {allPmaGallery{
            id
            title
            caption
            isActive
            dateStart
            dateEnd
            category
          }
      }`}).then(({ data }) => {
          callback(data["allPmaGallery"])
      });
  }

// display
  display(blob){
    super.display(blob)
    var listGallery = []
    // note: pas testé
    for(var url in blob.urlPmaImage){
      listGallery.push({"preview" : blob.urlPmaImage[url]})
    }
    this.setState({
        imageFiles:     listGallery,
        imageCmpFiles:  listGallery,
    })
  }

  // image callback
  onDrop(idx, imageFiles){
    var cp_galleries = this.state.galleries.slice()

    cp_galleries[idx].imageFile  = imageFiles
    console.log("this ", idx, cp_galleries[idx]);
    console.log("this", this.state.galleries[this.state.currentIndexSelected].imageFile[0]['preview']);
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
    gallery.push(new galleryStruct())

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
