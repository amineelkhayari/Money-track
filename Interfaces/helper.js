import { Buffer } from 'buffer';

  // @flow
// inspired by: https://github.com/davidchambers/base64.js/blob/master/base64.js

export const base64 = {
  btoa: (input = '')  => {
    return Buffer.from(input, 'base64').toString('utf8');


  },

  atob: (input = '') => {
    
    return Buffer.from(input, 'utf-8').toString('base64');

  }
};

