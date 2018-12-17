import { HOST } from '../index';

export function ajax(url: string): Promise<object> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", HOST + url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        //  ect(url + ': request failed');
      }
    };
    xhr.send();
  });
}