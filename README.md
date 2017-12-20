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
