
// appollo
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag'
// conf
import config from 'react-global-configuration';
import configuration from './config';

config.set(configuration);

const client = new ApolloClient({
  link: new HttpLink({ uri: config.get('url_servicePma_graphql')}),
  cache: new InMemoryCache()
});

//client.query({ query: gql`{allUsers{id}}`}).then(console.log);

client.mutate({
  mutation: gql`
  mutation mutation {
    createUser(addPet: {name: "petiboo"}, name: "saucisse") {
    user {
      id
      name
      }
    }
  }`}).then(console.log);

var axios = require('axios');

export function s_pushpma(title, image){
    var formData = new FormData();
    formData.append("file", image);

    axios.post(config.get('url_servicePma_uploadfile'), formData).then(function (response) {
        console.log("response.?", response.data["file_id"]);
    }).catch(function (error) {
        console.log(error);
    });;
}
