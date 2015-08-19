import fetch from 'isomorphic-fetch';
import merge from 'lodash/object/merge';

const INTERNAL_BASE = '/_api/';

function setupRequestOptions(options){
  options = merge({
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }, options);

  if (typeof options.body === 'object'){
    options.body = JSON.stringify(options.body);
  }

  return options;
}

export function api(url, options, context){
  const {AppStore, TokenStore} = context.getStore();
  const apiEndpoint = AppStore.getAPIEndpoint();

  options = setupRequestOptions(options);
  options.mode = 'cors';

  if (TokenStore.isLoggedIn()){
    options.headers.Authorization = 'Bearer ' + TokenStore.getToken();
  }

  return fetch(apiEndpoint + url, options);
}

export function internal(url, options, context){
  options = setupRequestOptions(options);

  const {AppStore} = context.getStore();
  options.headers['X-CSRF-Token'] = AppStore.getCSRFToken();
  options.credentials = 'include';

  return fetch(INTERNAL_BASE + url, options)
    .then(res => {
      // Update CSRF token
      let csrfToken = res.headers.get('X-CSRF-Token');

      if (csrfToken){
        AppStore.setCSRFToken(csrfToken);
      }

      return res;
    });
}

class ResponseError extends Error {
  constructor(res, body){
    super();

    this.name = 'ResponseError';
    this.message = res.statusText;
    this.response = res;
    this.body = body;
  }
}

export function parseJSON(res){
  return res.json();
}

export function filterError(res){
  if (res.status < 200 || res.status > 300){
    return res.json().then(json => {
      return Promise.reject(new ResponseError(res, json));
    }).catch(() => {
      return Promise.reject(new ResponseError(res));
    });
  }

  return res;
}
