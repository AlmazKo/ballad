export const HOST    = "http://localhost";
export const WS_HOST = "ws://localhost";


export function ajax(url: string, callback: (json: any) => void) {
  const req = new XMLHttpRequest();
  req.open("GET", HOST + url);
  req.onreadystatechange = function () {
    return req.readyState === 4 ? (req.status === 200 ? callback(JSON.parse(req.responseText)) : console.error(url + ': request failed')) : 0;
  };
  req.send();
}

export function ajax2(url: string): Promise<object> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", HOST + url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        console.error(url + ': request failed');
        reject(url + ': request failed');
      }
    };
    xhr.send();
  });
}