### Make builds the app and executes utility scripts ###

all: tests

build: mocha
	# Builds js, css, and runs tests to verify a branch

tests: mocha
	# Alias to maintain the convention of function task -> program name

mocha: test/helpers/*.spec.js test/server/*.spec.js test/app/*.spec.js
	@NODE_ENV=test ./node_modules/.bin/mocha $^ --reporter nyan

