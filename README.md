# node-image-loader

The Node.js Loader like next-image-loader

## Usage

```console
$ npm install node-image-loader
$ node --import node-image-loader index.js
```

```js
import jsLogo from "./assets/js.png";

console.log(jsLogo);
// {
//   src: 'data:image/png;base64,...',
//   width: 1052,
//   height: 1052,
// }
```
