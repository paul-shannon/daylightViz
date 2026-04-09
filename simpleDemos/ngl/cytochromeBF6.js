/**
 *  plastoquinone.js:  plastoquinone 
 */

import {Molecule} from './molecule.js';

const server = "http://127.0.0.1:5519/pdb/"
const pdb = "cytochrome-bf6-heme-porphyrin.pdb"
const URL = server + pdb;
const DEG = Math.PI / 180;

export class Cytochrome extends Molecule {


  constructor(stage) {
     super(stage, URL);
     console.log("--- leaving photon::ctor")
     }

  buildRepresentations() {
    console.log("photon::buildRepresentations")
    console.log("this.component: ")
    console.log(this.component)
    this.component.addRepresentation("ball+stick");
    }

  afterLoad() {
    this.component.setPosition([-147, -205, -178])
    this.component.setRotation([0, -70*DEG, -10*DEG])
    }

} // class Cytochrome

