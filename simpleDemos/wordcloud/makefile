default:
	@echo venv
	@echo server
	@echo pid
	@echo view.htmls
	@echo app

PORT = 5006

venv:
	@echo source /Users/paul/github/slexil2/py3119slexil/bin/activate

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

view.htmls:
	open http://127.0.0.1:$(PORT)

app:
	open http://127.0.0.1:$(PORT)/wordcloudDemo.html



