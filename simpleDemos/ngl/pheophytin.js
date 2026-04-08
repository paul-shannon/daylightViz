/**
 *  pheophytin.js:  pheophytin 
 */

import {Molecule} from './molecule.js';
const server = "http://127.0.0.1:5519/pdb/"
const pdb = "pheophytin-no-tail.pdb"
const URL = server + pdb;

export class Pheophytin extends Molecule {

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
    this.component.setPosition( [0,       0,  2.12])
    this.component.setRotation([-Math.PI/8,-Math.PI/4, 0])
    }

} // class Pheophytin

