import React, { Component} from 'react';
import {configFor} from '../Services/Graph.js'

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      rememberMe: false
    }
    this.onLogin = this.onLogin.bind(this);
  }

  static isAutologged(){
    // l'un des deux
    return (localStorage.getItem('login') && sessionStorage.getItem('login')) !== null
  }

  getStorage(){
    return this.state.rememberMe? localStorage : sessionStorage
  }

  isUserExist(callback){
      var axios = require('axios')
      let configJson = {
        url: configFor('url_servicePma_graphql'),
        method: 'post',
        data: {
          query: `query user{ userExist(user: {name:${JSON.stringify(this.state.login)}, password: ${JSON.stringify(this.state.password)}})}`
        }
    };
    // swap bewteen configGraphQL and configJson (same response)
    axios(configJson).then(response => {
      callback(response.data.data["userExist"])
    }).catch(err => {
      console.log('graphql error:', err);
      callback(false)
    });
  }

  onLogin(){
      var _this   = this
      console.log("---> ", Login.isAutologged());
      this.isUserExist(function(value){
        if(value === true){
          var storage = _this.getStorage()
          storage.setItem('password', _this.state.password);
          storage.setItem('login', _this.state.login);
        }else{
          window.Materialize.toast('Mot-de-passe / Login invalide ', 4000)
        }
      })
  }

  getStorage(){
      return this.state.rememberMe? localStorage : sessionStorage
  }

  render() {
    return (
      <div className="container">
        <div className="container" style={{width:"400px"}}>
          <label htmlFor="uname"><b>Username</b></label>

          <input value={this.state.login} onChange={(e) => this.setState({login: e.target.value})} type="text" placeholder="Entrez nom d'utilisateur" name="uname" required />
          <label htmlFor="psw"><b>Password</b></label>

          <input value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} type="password" placeholder="Entrez mot-de-passe" name="psw" required />
        </div>
        <form>
          <p className="center-align">
            <input type="checkbox" id="remember"/>
            <label htmlFor="remember" value={this.state.rememberMe} onChange={(e) => this.setState({rememberMe: e.target.value})}>Remember me</label>
          </p>
        </form>
        <a className="waves-effect waves-light btn" onClick={this.onLogin} ><i className="material-icons left"></i>Login</a>

        </div>

      );
  }
}
