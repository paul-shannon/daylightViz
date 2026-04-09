/**
 * chlorophyll.js
 *
 * Chlorophyll a (cla-no-tail.pdb) — subclass of Molecule.
 *
 * Adds:
 *   • load-time position and rotation matching the ETC demo layout
 *   • excited-state porphyrin-ring overlay (hidden until illuminate() is called)
 *   • illuminate()  – flash the ring yellow to simulate photon absorption
 *   • relax()       – hide the excited-state overlay
 *
 * Usage
 * -----
 *   import { Chlorophyll } from './chlorophyll.js';
 *
 *   const cla = new Chlorophyll(stage);
 *   await cla.load();
 *   cla.illuminate();      // porphyrin ring flashes yellow
 *   cla.relax();           // back to ground state
 *   cla.remove();
 *   await cla.restore();   // reloaded, re-positioned, ready again
 */

import { Molecule } from './molecule.js';

const CLA_URL = "http://127.0.0.1:5519/pdb/cla-no-tail.pdb";

const PORPHYRIN_RING = [
  // "MG",
  "CHA", "CHB", "CHC", "CHD",
  "NA",  "NB",  "NC",  "ND",
  "C1A", "C2A", "C3A", "C4A",
  "C1B", "C2B", "C3B", "C4B",
  "C1C", "C2C", "C3C", "C4C",
  "C1D", "C2D", "C3D", "C4D",
].map(n => `.${n}`).join(" or ");

export class Chlorophyll extends Molecule {

  constructor(stage) {
    super(stage, CLA_URL);
    this.excitedRep = null;
    }

  buildRepresentations(){
    console.log("cla buildRepresentations")
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
    this.component.setRotation([Math.PI / 4.4, 0, 0]);
    this.component.setPosition([20, -43, -53.8]);
    }

  excite(){
     this.excitedRep.setVisibility(true);
     };

   relax() {
     this.excitedRep.setVisibility(false);
     }

} // class Chlorophyll
