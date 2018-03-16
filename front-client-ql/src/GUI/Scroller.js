import ReactDOM from 'react-dom';

// pma classique
export class Scroller{
  constructor() {
    this.resetCoordinate()
  }

  onMouseUp(event, scroll) {
    this.resetCoordinate()
  }

  onMouseLeave(){
    this.resetCoordinate()
  }

  onMouseMove(event, scroll) {
    if(this.isActive === true){
      var dropMen = ReactDOM.findDOMNode(scroll)
      var deltaX  = (event.screenX - this.deltaX) 
      dropMen.scrollLeft -= deltaX;
      this.deltaX = event.screenX;
    }
  }

  onMouseDown(event, scroll) {
    this.isActive = true;
    this.deltaX   = event.screenX;
  }

  resetCoordinate(){
    this.isActive = false;
    this.deltaX   = 0;
  }
}
