default:
	@echo venv
	@echo server
	@echo pid
	@echo view.htmls
	@echo view.pdbs
	@echo etcApp
	@echo photosynthesis

PORT = 5505

venv:
	@echo source /Users/paul/github/slexil2/py3119slexil/bin/activate

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

view.htmls:
	open http://127.0.0.1:$(PORT)

view:
	open http://127.0.0.1:$(PORT)/minimal-ngl.html

view.pdbs:
	open http://127.0.0.1:$(PORT)/pdb

etcApp:
	open http://127.0.0.1:$(PORT)/etc/etcMolecules.html

photosynthesis:
	open http://127.0.0.1:$(PORT)/etc/photosynthesis.html


