default:
	@echo venv
	@echo server
	@echo pid
	@echo test

PORT = 6001

venv:
	@echo source /Users/paul/github/slexil2/py3119slexil/bin/activate

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

test:
	open http://127.0.0.1:$(PORT)

test.pdbs:
	open http://127.0.0.1:60050


