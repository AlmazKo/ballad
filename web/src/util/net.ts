export function ajax(url: string, callback: (json: any) => void) {
  const req = new XMLHttpRequest();
  req.open("GET", url);
  req.onreadystatechange = function () {
    return req.readyState === 4 ? (req.status === 200 ? callback(JSON.parse(req.responseText)) : console.error(url + ': request failed')) : 0;
  };
  req.send();
}