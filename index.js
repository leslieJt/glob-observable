const { Observable } = require('rxjs/Observable')
const glob = require('glob')
const toAbsGlob = require('to-absolute-glob')

/**
 * convert relative ignore path to absoulte.
 * @param {Array<string> | string} ignore
 * @returns {Array<string> | string}
 * @api private
 */
const toAbs = (ignore, opts) => {
  if (typeof ignore === 'string') {
    return toAbsGlob(ignore, opts)
  } else if (ignore instanceof Array) {
    return ignore.map(i => toAbsGlob(i, opts))
  }
}

/**
 * wrap glob stream into Observable
 * each value of Observable emited is just a absoulte path.
 * @param {string} pattern
 * @param {Object} opts
 * @returns {Observable<string>}
 */
module.exports = (pattern, opts) =>
  Observable.create(observer => {
    opts = opts || {}
    pattern = toAbsGlob(pattern, opts)
    if (opts.ignore) opts.ignore = toAbs(opts.ignore, opts)

    if (opts && opts.sync) {
      delete opts.sync
      try {
        const files = glob.sync(pattern, opts)

        files.forEach(f => observer.next(f))
        observer.complete()
      } catch (err) {
        observer.error(err)
      }
    } else {
      const globber = glob(pattern, opts)

      globber.on('match', m => observer.next(m))
      globber.once('end', () => observer.complete())
      globber.once('error', err => observer.error(err))

      return () => globber.abort()
    }
  })

// const glob = require('glob-observable')
const { count } = require('rxjs/operators/count')
const { map } = require('rxjs/operators/map')
const { max } = require('rxjs/operators/max')
const fs = require('fs')

module
  .exports('./**')
  .pipe(
    map(p => ({ size: fs.statSync(p).size, path: p })),
    max((x, y) => x.size > y.size)
  )
  .subscribe(c => console.log('max size file:', c))
