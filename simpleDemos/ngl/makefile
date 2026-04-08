default:
	@echo venv
	@echo server
	@echo pid
	@echo htmls
	@echo pdbs
	@echo etcApp
	@echo photosynthesis

PORT = 5519

venv:
	@echo source /Users/paul/github/slexil2/py3119slexil/bin/activate

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

htmls:
	open http://127.0.0.1:$(PORT)

view:
	open http://127.0.0.1:$(PORT)/minimal-ngl.html

pdbs:
	open http://127.0.0.1:$(PORT)/pdb

etcApp:
	open http://127.0.0.1:$(PORT)/etc/etcMolecules.html

photosynthesis:
	open http://127.0.0.1:$(PORT)/etc/photosynthesis.html


