
// appollo
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// conf
import config from 'react-global-configuration';
import configuration from '../config';

config.set(configuration);

// graphQL
export const apollo_client = new ApolloClient({
  link: new HttpLink({ uri: config.get('url_servicePma_graphql')}),
  cache: new InMemoryCache(),
});

// file upload
export function uploadfile(image, callback){
    var file = new FormData();
    file.append("file", image);

    var axios = require('axios');
    axios.post(config.get('url_servicePma_uploadfile'), file).then(function (response) {
        callback(response.data["file_id"], null);
    }).catch(function (error) {
      callback(null, error);
    });
}
