
// appollo
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import gql from 'graphql-tag'
// conf
import config from 'react-global-configuration';
import configuration from './config';

config.set(configuration);

export const apollo_client = new ApolloClient({
  link: new HttpLink({ uri: config.get('url_servicePma_graphql')}),
  cache: new InMemoryCache(),
});

/*
client.mutate({
  mutation: gql`
  mutation mutation {
    createUser(addPet: {name: "petiboo"}, name: "saucisse") {
    user {
      id
      name
      }
    }
  }`,  variables: { file } }).then(console.log);
*/
/*
apollo_client.mutate({mutation: gql
  `mutation mutation{
    mutatePmaHome(pmaData: {title: "new pma from appollo", caption: "legend"}) {
      pma{
        title
        caption
      }
    }
  }`}).then(console.log);
*/
/*
client.mutate({
  mutation: gql`
  mutation mutation {
    createUser(addPet: {name: "petiboo"}, name: "saucisse") {
    user {
      id
      name
      }
    }
  }`,  variables: { file } }).then(console.log);
*/

// a supprimer
export function s_pushpma(title, image){
    var formData = new FormData();
    formData.append("file", image);
    console.log("will upload");
    uploadfile(formData, function(formData, error){
      console.log("response.?", formData, error);
    });
}

// private
var axios = require('axios');

function uploadfile(file, callback) {
    axios.post(config.get('url_servicePma_uploadfile'), file).then(function (response) {
        callback(response.data["file_id"], null);
    }).catch(function (error) {
      callback(null, error);
    });
}
