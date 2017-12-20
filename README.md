# glob-observable

A Simple Observable interface over node-glob.

## Example

### Install

```bash
npm install simple-glob-observable
```

```javascript
const fs = require('fs')
const glob = require('simple-glob-observable')
const { map } = require('rxjs/operators/map')
const { max } = require('rxjs/operators/max')

glob('./**', { ignore: 'node_modules/**' })
  .pipe(
    map(p => ({ size: fs.statSync(p).size, path: p })),
    max((x, y) => x.size > y.size)
  )
  .subscribe(c => console.log('max size file:', c.path))
```

### Usage

_glob(pattern, [options])_

### Options

`sync`: perform a synchronous glob search, default is false.

see [node-glob](https://github.com/isaacs/node-glob#options) for more details.
