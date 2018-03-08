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
      var deltaX  = (event.screenX - this.deltaX) * /* speed */ 0.1
      dropMen.scrollLeft -= deltaX;
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
