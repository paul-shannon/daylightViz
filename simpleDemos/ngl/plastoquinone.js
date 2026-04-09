/**
 *  plastoquinone.js:  plastoquinone 
 */

import {Molecule} from './molecule.js';
const server = "http://127.0.0.1:5519/pdb/"
const pdb = "p19-no-tail.pdb"
const URL = server + pdb;
const DEG = Math.PI / 180;

const PORPHYRIN_RING=
   ["C1", "C2", "C3", "C4", "C5", "C6"].map(n => `.${n}`).join(" or ");


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
    this.excitedRep = this.component.addRepresentation(
          "spaceFill", {
           sele:         PORPHYRIN_RING,
           colorValue:   "#ffee22",
           multipleBond: "symmetric",
          });
      this.excitedRep.setVisibility(false);
    }

  afterLoad() {
    this.component.setRotation([-37*DEG,120*DEG,20*DEG])
    this.component.setPosition([16,-20,15])
    }

  excite(){
     this.excitedRep.setVisibility(true);
     };

   relax() {
     this.excitedRep.setVisibility(false);
     }

} // class Plastoquinone

