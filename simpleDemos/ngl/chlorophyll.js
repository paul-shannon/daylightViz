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

// Conjugated macrocycle: Mg + methine bridges + pyrrole N + pyrrole-ring C
const PORPHYRIN_RING_SELE = [
  "MG",
  "CHA", "CHB", "CHC", "CHD",
  "NA",  "NB",  "NC",  "ND",
  "C1A", "C2A", "C3A", "C4A",
  "C1B", "C2B", "C3B", "C4B",
  "C1C", "C2C", "C3C", "C4C",
  "C1D", "C2D", "C3D", "C4D",
].map(n => `name ${n}`).join(" or ");

// Blink sequence: [visible, durationMs] pairs simulate absorption → excited → relax
const BLINK_SEQUENCE = [
  [true,   90],
  [false,  60],
  [true,   90],
  [false,  60],
  [true,  200],
  [false,   0],
];

export class Chlorophyll extends Molecule {
  constructor(stage) {
    super(stage, CLA_URL);
    this._excitedRep = null;   // set in buildRepresentations()
  }

  // ── Overrides ──────────────────────────────────────────────────────────────

  buildRepresentations(comp) {
    // Ground-state: element-coloured ball+stick, double bonds explicit
    comp.addRepresentation("ball+stick", { multipleBond: "symmetric" });

    // Excited-state overlay: porphyrin ring, bright yellow, initially hidden
    this._excitedRep = comp.addRepresentation("ball+stick", {
      sele:         PORPHYRIN_RING_SELE,
      colorValue:   "#ffee22",
      opacity:      0.95,
      multipleBond: "symmetric",
      visible:      false,
    });
  }

  afterLoad(comp) {
    // Position matching the ETC demo (chlorophyll a sits offset from centre)
    comp.setRotation([Math.PI / 4.4, 0, 0]);
    comp.setPosition([20, -43, -53.8]);
  }

  // ── Chlorophyll-specific behaviors ─────────────────────────────────────────

  /**
   * Flash the porphyrin ring yellow to simulate photon absorption.
   * Returns a Promise that resolves when the animation completes.
   */
  illuminate() {
    if (!this._excitedRep) return Promise.resolve();
    const rep   = this._excitedRep;
    const stage = this.stage;

    return new Promise(resolve => {
      let i = 0;
      function step() {
        if (i >= BLINK_SEQUENCE.length) { resolve(); return; }
        const [visible, delay] = BLINK_SEQUENCE[i++];
        rep.setVisibility(visible);
        stage.viewer.requestRender();
        setTimeout(step, delay);
      }
      step();
    });
  }

  /** Hide the excited-state overlay (return to ground state). */
  relax() {
    this._excitedRep?.setVisibility(false);
    this.stage.viewer.requestRender();
  }
}
