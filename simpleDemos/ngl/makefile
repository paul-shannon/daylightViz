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

demo:
	open http://127.0.0.1:5519/etcClass.html 

publish:
	scp etcClass.html paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/index.html
	scp molecule.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	scp ps1.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	scp ps2.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	scp chlorophyll.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	scp photon.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	scp pheophytin.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	scp plastoquinone.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	scp cytochromeBF6.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	scp plastocyanin.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/


rsync:
	rsync -a pdb paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/pdb
	rsync -a molecule.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	rsync -a ps1.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	rsync -a ps2.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	rsync -a chlorophyll.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	rsync -a photon.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	rsync -a pheophytin.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	rsync -a plastoquinone.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	rsync -a cytochromeBF6.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/
	rsync -a plastocyanin.js  paulshannnon@pshannon.net:public_html/pshannon.net/daylightViz/


viewRemote:
	open https://pshannon.net/daylightViz



