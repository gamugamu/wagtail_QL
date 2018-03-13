import React, { Component} from 'react';


export class FooterKiabi extends Component {

  render() {
    return (
        <div className="App-footer">
          <div className="row">
            <div className="col s12">
              <h5 className="grey-text">Kiabi PMA</h5>
              <p className="grey-text text-lighten-1">Gestionnaire de pma pour les applications mobiles</p>
            </div>
          </div>

          <div className="footer-copyright">
            <div className="container">
            © 2018 Copyright Text
            </div>
          </div>
        </div>
    );
  }
}
