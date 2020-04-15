# ordered-object-literal

## Install

Do not use it if you can use maps.

```sh
yarn add ordered-object-literal
```

or if npm is package manager of your choice

```sh
npm install ordered-object-literal --save
```

## Usage

### I want to create a new object

```js
import box from 'ordered-object-literal';

const trackedObj = box({});
```

### I have an existing object

```js
import box from 'ordered-object-literal';

const myObj = { 
  a: true,
  b: void 0,
};

const trackedObj = box(myObj);
// alternatively if you want to provide a custom orer
const trackedReversedObj = box(myObj, ['b', 'a']);
```

## LICENSE

[MIT](https://github.com/P0lip/ordered-object-literal/blob/master/LICENSE)
