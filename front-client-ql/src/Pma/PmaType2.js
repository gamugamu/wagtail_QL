import React from 'react';
import {Pmatype1} from './PmaType1.js'

export class Pmatype2 extends Pmatype1{
  constructor(props) {
    super(props);
    /*
    this.state = {
      imageFiles: [],
      imageCmpFiles: []
    };
    */
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
}
