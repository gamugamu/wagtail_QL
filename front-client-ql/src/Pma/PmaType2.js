import React from 'react';
import {Pmatype1} from './PmaType1.js'
import Dropzone from  'react-dropzone';

export class Pmatype2 extends Pmatype1{
  constructor(props) {
    super(props);
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
  r_cardImageCollection = () => {
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
