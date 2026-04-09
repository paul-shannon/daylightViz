/**
 *  pheophytin.js:  pheophytin 
 */

import {Molecule} from './molecule.js';
const server = "http://127.0.0.1:5519/pdb/"
const pdb = "pheophytin-no-tail.pdb"
const URL = server + pdb;

const PORPHYRIN_RING = [
  "CHA", "CHB", "CHC", "CHD",
  "NA",  "NB",  "NC",  "ND",
  "C1A", "C2A", "C3A", "C4A",
  "C1B", "C2B", "C3B", "C4B",
  "C1C", "C2C", "C3C", "C4C",
  "C1D", "C2D", "C3D", "C4D",
  ].map(n => `.${n}`).join(" or ");


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
    this.excitedRep = this.component.addRepresentation(
          "spaceFill", {
           sele:         PORPHYRIN_RING,
           colorValue:   "#ffee22",
           multipleBond: "symmetric",
          });
     this.excitedRep.setVisibility(false);
     }

  afterLoad() {
    this.component.setPosition( [0,       0,  2.12])
    this.component.setRotation([-Math.PI/8,-Math.PI/4, 0])
    }

  excite(){
     this.excitedRep.setVisibility(true);
     };

   relax() {
     this.excitedRep.setVisibility(false);
     }



} // class Pheophytin

