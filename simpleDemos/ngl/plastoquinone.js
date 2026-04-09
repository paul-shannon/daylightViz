/**
 *  plastoquinone.js:  plastoquinone 
 */

import {Molecule} from './molecule.js';
const server = "http://127.0.0.1:5519/pdb/"
const pdb = "p19-no-tail.pdb"
const URL = server + pdb;
const DEG = Math.PI / 180;

export class Plastoquinone extends Molecule {


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
    this.component.setRotation([-37*DEG,120*DEG,20*DEG])
    this.component.setPosition([16,-20,15])
    }

} // class Plastoquinone

