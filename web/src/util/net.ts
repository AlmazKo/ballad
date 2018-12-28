import { HOST } from '../index';

export function ajax(url: string): Promise<object> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", HOST + url);
    xhr.onerror = () => {
      reject(url + ': request failed')
    };
    xhr.onload  = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(url + ': request failed');
      }
    };
    xhr.send();
  });
}