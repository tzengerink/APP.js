fs = require 'fs'

{print} = require 'sys'
{spawn} = require 'child_process'

compile = (callback) ->
  coffee = spawn 'coffee', ['-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

tests = (callback) ->
  coffee = spawn 'coffee', ['-c', '-o', 'tests/lib', 'tests/src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

docs = (callback) ->
  docco = spawn 'docco', ['src/*.coffee']
  docco.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  docco.on 'exit', (code) ->
    callback?() if code is 0

task 'compile', 'Compile lib from src', ->
  compile()

task 'tests', 'Compile test/lib from test/src', ->
  tests()

task 'docs', 'Setup documentation', ->
  docs()

task 'build', 'Build source, tests and documentation', ->
  compile()
  tests()
  docs()
