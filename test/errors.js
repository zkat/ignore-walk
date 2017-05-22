const t = require('tap')
const walk = require('../')
const Walker = walk.Walker
const WalkerSync = walk.WalkerSync
const mutateFS = require('mutate-fs')

require('./common.js').ignores({
  '.ignore': ['*', '!a/b/c/.abc', '!/c/b/a/cba']
})

t.test('error only emits once', t => {
  const poop = new Error('poop')
  t.teardown(mutateFS.statFail(poop))

  t.test('async', t => {
    let sawError = false
    const w = new Walker({ path: __dirname })
    w.on('error', er => {
      t.equal(er, poop)
      if (sawError)
        throw er
      sawError = true
      w.emit('error', new Error('not poop'))
      t.end()
    })
  })

  t.test('sync', t => {
    t.throws(_ => new WalkerSync({ path: __dirname }), poop)
    t.end()
  })

  t.end()
})

t.test('readdir error', t => {
  const poop = new Error('poop')
  t.teardown(mutateFS.fail('readdir', poop))

  t.test('async', t => {
    new Walker({}).on('error', er => {
      t.equal(er, poop)
      t.end()
    })
  })

  t.test('sync', t => {
    t.throws(_ => new WalkerSync(), poop)
    t.end()
  })

  t.end()
})

t.test('readFile error', t => {
  const poop = new Error('poop')
  t.teardown(mutateFS.fail('readFile', poop))

  t.test('async', t => {
    new Walker().on('error', er => {
      t.equal(er, poop)
      t.end()
    })
  })

  t.test('sync', t => {
    t.throws(_ => new WalkerSync(), poop)
    t.end()
  })

  t.end()
})
