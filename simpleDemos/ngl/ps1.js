/**
 *  ps2.js:  photosystem II
 */

import {Molecule} from './molecule.js';
const server = "http://127.0.0.1:5519/pdb/"
const pdb = "7NHO.pdb"
const URL = server + pdb;

export class Photosystem1 extends Molecule {

  constructor(stage) {
     super(stage, URL);
     }

  buildRepresentations() {
    this.component.addRepresentation("spaceFill", {color: "residueIndex"})
    }

  afterLoad() {
    this.component.setPosition([-360,-220,-60])
    }

} // class Photosystem1

