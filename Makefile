### Make builds the app and executes utility scripts ###

all: browserify mocha

# Builds js, css, and runs tests to verify a branch
build: browserify mocha


# Alias to maintain the convention of function task -> program name
tests: mocha

# Server and Client-side tests
mocha: test/helpers/*.spec.js test/server/*.spec.js test/app/*.spec.js
	@NODE_ENV=test ./node_modules/.bin/mocha $^ --reporter nyan

# Manages JS dependencies and compiles to single JS
browserify: app/app.js
	./node_modules/.bin/browserify $^ -o server/static/lib/bundle.js -t hbsfy

compass: app/sass/screen.scss app/sass/partials/*.scss
	compass compile --config app/sass/config.rb