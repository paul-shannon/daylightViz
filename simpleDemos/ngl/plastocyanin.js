/**
 *  plastoquinone.js:  plastoquinone 
 */

import {Molecule} from './molecule.js';

const server = "http://127.0.0.1:5519/pdb/"
const pdb = "3BQV-plastocyanin.pdb"
const URL = server + pdb;
const DEG = Math.PI / 180;

export class Plastocyanin extends Molecule {


  constructor(stage) {
     super(stage, URL);
     console.log("--- leaving photon::ctor")
     }

  buildRepresentations() {
    this.component.addRepresentation("ribbon", {color: "residueIndex"})

    this.component.addRepresentation("spacefill",
                                     {sele: "CU",
                                     radiusScale: 1})
    }

  afterLoad() {
    this.component.setPosition([40,-80,8])        
    this.component.setRotation([0*DEG, 270*DEG, 40*DEG])
    }

  travel(){
     let nextOperation = function(){console.log("after plastocyanin move")}
     this.move([-222, -72, 91], 50, 100, nextOperation)
  }

} // class Plastocyanin

