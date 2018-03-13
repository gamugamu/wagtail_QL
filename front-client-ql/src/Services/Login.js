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

    var _this = this
    this.onLogin = this.onLogin.bind(this);

    this.isAdminExist(function(isAdminExist){
      if(!isAdminExist){
        _this.clearStorage()
      }
    })
  }

  static isUserlogged(){
    // l'un des deux
    return (sessionStorage.getItem('login')) !== null
  }

  static userData(){
    // l'un des deux
    return [sessionStorage.getItem('login'), sessionStorage.getItem('password')]
  }

  store(login, password){
    sessionStorage.setItem('login', login)
    sessionStorage.setItem('password', password)
  }

  getStorage(){
    return localStorage
  }

  clearStorage(){
    sessionStorage.clear();
  }

  isUserExist(callback){
      var axios = require('axios')
      let configJson = {
        url: configFor('url_servicePma_graphql'),
        method: 'post',
        data: {
          query: `query user{ userExist(
            user: {
              name: ${JSON.stringify(this.state.login)},
              password: ${JSON.stringify(this.state.password)}}
            )}`
        }
      };

    // swap bewteen configGraphQL and configJson (same response)
    axios(configJson).then(response => {
      callback(response.data.data["userExist"])
    }).catch(err => {
      console.log("err?", err);
      callback(false)
    });
  }

  isAdminExist(adminDoesntExist=null){
    var axios = require('axios')
    let configJson = {
      url: configFor('url_servicePma_graphql'),
      method: 'post',
      data: {
        query: `query admin{ adminExist }`
      }
    };

    // swap bewteen configGraphQL and configJson (same response)
    axios(configJson).then(response => {
      var adminExist = response.data.data["adminExist"]
      adminDoesntExist(adminExist)
    }).catch(err => {
      console.log("error", err);
      adminDoesntExist(false)
    });
  }

  createUser(callback){
      var axios = require('axios')
      let configJson = {
        url: configFor('url_servicePma_graphql'),
        method: 'post',
        data: {
          query: `mutation create{
            createUser(user: {
                name: ${JSON.stringify(this.state.login)},
            password: ${JSON.stringify(this.state.password)}}) {
              user {
                name
              }
            } }`
        }
    };

    // swap bewteen configGraphQL and configJson (same response)
    axios(configJson).then(response => {
      callback(true)
    }).catch(err => {
      callback(false)
    });
  }

  onLogin(){
      var _this   = this
      this.isUserExist(function(exist){
        if(exist === true){
          _this.store(_this.state.login, _this.state.password)
          _this.props.onLogged();
        }else{
          window.Materialize.toast('Mot-de-passe / Login invalide ', 4000)
        }
      })
  }

  render() {
    return (
      <div className="container">
        <div className="container">
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
        <a style={{marginTop:"10px"}} className="waves-effect waves-light btn" onClick={this.onLogin} ><i className="material-icons left"></i>Login</a>
        </div>

      );
  }
}
