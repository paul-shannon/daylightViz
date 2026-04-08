/**
 *  ps2.js:  photosystem II
 */

import {Molecule} from './molecule.js';
const server = "http://127.0.0.1:5519/pdb/"
const pdb = "1s5l.pdb"
const URL = server + pdb;

export class Photosystem2 extends Molecule {

  constructor(stage) {
     super(stage, URL);
     }

  buildRepresentations() {
    this.component.addRepresentation("cartoon",    {sele: ":A", color: "residueIndex"})
    this.component.addRepresentation("spacefill",  {sele: "[OEC] AND :A"})
    this.component.addRepresentation("ball+stick", {sele: "[CLA] AND 352 AND :A"})
    this.component.addRepresentation("ball+stick", {sele: "[PL9] AND 353 AND :A"})
    this.component.addRepresentation("ball+stick", {sele: "[PHE] AND 33 :A"})
    this.component.setVisibility(true);
    }

  afterLoad() {
    //this.component.setRotation([Math.PI / 4.4, 0, 0]);
    //this.component.setPosition([20, -43, -53.8]);
    }

} // class Photosystem2

