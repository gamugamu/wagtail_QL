import React from 'react';

// gere les collection de pma
export class PmaCollectionManager extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pma: [],
      queries: ''
    };
    this.appendNewPma = this.appendNewPma.bind(this);
    this.onDelete     = this.onDelete.bind(this)
    // display le nombre d'object de ce type
    var _this = this
    this.props.typePma.handleQuerieFindAllElmt(function(data){
      _this.setState({
          pma: data
      })
    })
  }

  appendNewPma(){
    var newPma = this.state.pma.slice();
    newPma.push(this.props.typePma);
    this.setState({pma:newPma})
  }

  onDelete(idx){
    var pma = this.state.pma.slice();
    pma.shift()
    //  console.log("index---> ", this.refs['pma' + idx.toString()], mountNode);
    this.setState({pma:pma})
  }

  render() {
    return (
      <div id="scroller-wrapper">
        <div id="scroller">
          <a className="waves-effect waves-light btn" onClick={this.appendNewPma}>new</a>
          {this.state.pma.map((Item, index) => (
            <this.props.typePma
              key       = {index}
              ref       = {(child) => { child.display(Item)}}
              onDelete  = {() => this.onDelete(index)}
            />
            ))}
        </div>
      </div>
    );
  }
}
