/**
 *  photon.js:  photon
 */

import {Molecule} from './molecule.js';
const server = "http://127.0.0.1:5519/pdb/"
const pdb = "sun.pdb"
const URL = server + pdb;

export class Photon extends Molecule {

  constructor(stage) {
     super(stage, URL);
     console.log("--- leaving photon::ctor")
     }

  buildRepresentations() {
    console.log("photon::buildRepresentations")
    console.log("this.component: ")
    console.log(this.component)
    this.component.addRepresentation("spaceFill",
                                     {color: "red", radiusScale: 2});
    }

   afterLoad() {
       this.component.setPosition([this.position[0],
                                   this.position[1],
                                   this.position[2]])
    }

    travel(){
       const self = this;
       let nextOperation = function(){
           console.log("absorb photon")
           self.hide()
           cla.excite()
           stage.autoView(2000);
           }
       this.move([40.5, -11.7, 0], 20, 100, nextOperation)
       }

} // class Photon
//---------------------------------------------------------------------------
