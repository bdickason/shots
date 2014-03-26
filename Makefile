### Make builds the app and executes utility scripts ###

all: browserify compass

# Builds js, css, and runs tests to verify a branch
build: browserify compass mocha

# Watch SASS/JS for changes
watch:
	${MAKE} -j4 watchify compassWatch

# Alias to maintain the convention of function task -> program name
tests: mocha

# Server and Client-side tests
mocha: test/helpers/*.spec.js test/server/*.spec.js test/app/*.spec.js
	@NODE_ENV=test ./node_modules/.bin/mocha $^ --reporter nyan

# Manages JS dependencies and compiles to single JS
browserify: app/app.js
	./node_modules/.bin/browserify $^ -o server/static/lib/bundle.js -t hbsfy

# Watch Browserify
watchify: app/app.js
	./node_modules/.bin/watchify $^ -v -o server/static/lib/bundle.js -t hbsfy

# Compiles SASS to CSS
compass: app/sass/screen.scss app/sass/partials/*.scss
	compass compile --config app/sass/config.rb

# Watch Compass
compassWatch: app/sass/screen.scss app/sass/partials/*.scss
	compass watch --config app/sass/config.rb