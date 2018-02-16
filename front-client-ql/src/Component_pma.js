import React, { Component } from 'react';

export class PmaType0 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      image: '',

    };
  }

   render() {
      return (
         <div className="container z-depth-1 row">
            <ul className="collection">
              <li className="collection-item">
                <div className="input-field">
                  <input onChange={(e) => this.setState({ title: e.target.value }) } id="input_000" type="text" className="validate"></input>
                  <label className="active" htmlFor="first_name2">Titre</label>
                </div>
              </li>
              <li className="collection-item">
              <div className="input-field">
                <input id="icon_prefix" type="text" className="validate"></input>
                <label htmlFor="icon_prefix">First Name</label>
              </div>
              </li>
              <li className="collection-item">
                <form action="#">
                  <div className="file-field input-field">
                    <div className="btn">
                      <span>File</span>
                      <input type="file" onChange={(e) => this.setState({ image : e.target.files }) }></input>
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text"></input>
                    </div>
                  </div>
                  </form>
              </li>
              <li className="collection-item">
                <button className="btn waves-effect pink accent-2" type="submit" name="action" onClick={() => this.props.onValidate()}>Submit
                  <i className="material-icons right">send</i>
                </button>
              </li>
            </ul>
          </div>
      );
   }
}
