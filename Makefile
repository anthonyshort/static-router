
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

coffee:
	@coffee -c -o ./test ./test

clean:
	rm -fr build components template.js

.PHONY: clean
