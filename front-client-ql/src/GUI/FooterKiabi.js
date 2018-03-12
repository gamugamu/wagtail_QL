import React, { Component} from 'react';


export class FooterKiabi extends Component {

  render() {
    return (
        <div className="App-footer">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">Kiabi PMA</h5>
              <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
            </div>
          </div>

          <div className="footer-copyright">
            <div className="container">
            © 2018 Copyright Text
            <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
            </div>
          </div>

        </div>
    );
  }
}
