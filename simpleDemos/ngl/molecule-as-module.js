/**
 * molecule.js
 *
 * ES6 module encapsulating a single NGL molecule (cla-no-tail.pdb) with
 * four behaviors: load, display, remove, restore.
 *
 * Behaviors
 * ---------
 *   load()     – fetch PDB from server, build ball+stick representation,
 *                make the component visible.  Returns the NGL component.
 *                No-op if already loaded.
 *
 *   display()  – set the component visible (after a hide or after load).
 *
 *   remove()   – fully drop the component from the NGL stage and free its
 *                geometry (stage.removeComponent).  component becomes null.
 *
 *   restore()  – re-load the PDB if the component was removed, otherwise
 *                just calls display().  Returns a Promise that resolves to
 *                the NGL component.
 *
 * Usage
 * -----
 *   import { createMolecule } from './molecule.js';
 *
 *   const stage = new NGL.Stage("viewport");
 *   const mol   = createMolecule(stage);
 *
 *   await mol.load();        // fetch & show
 *   mol.display();           // no-op (already visible)
 *   mol.remove();            // gone from stage
 *   await mol.restore();     // reloaded & visible again
 *
 *   // Access the raw NGL component if needed:
 *   console.log(mol.component);
 */

const PDB_URL = "http://127.0.0.1:5519/pdb/cla-no-tail.pdb";

// Conjugated porphyrin-ring macrocycle atom names (from cla-no-tail.pdb residue CLA).
// Used to build an optional excited-state overlay representation.
const PORPHYRIN_RING_SELE = [
  "MG",
  "CHA", "CHB", "CHC", "CHD",
  "NA",  "NB",  "NC",  "ND",
  "C1A", "C2A", "C3A", "C4A",
  "C1B", "C2B", "C3B", "C4B",
  "C1C", "C2C", "C3C", "C4C",
  "C1D", "C2D", "C3D", "C4D",
].map(n => `name ${n}`).join(" or ");

/**
 * Factory that returns a molecule controller bound to the given NGL stage.
 *
 * @param {NGL.Stage} stage  - An already-constructed NGL.Stage instance.
 * @param {string}    [url]  - Override the PDB URL (default: cla-no-tail.pdb).
 */
export function createMolecule(stage, url = PDB_URL) {
  let _component = null;   // NGL StructureComponent, or null if not loaded / removed

  // ── Internals ──────────────────────────────────────────────────────────────

  async function _loadFromServer() {
    const comp = await stage.loadFile(url);

    // Primary ball+stick representation with conjugated double bonds shown.
    comp.addRepresentation("ball+stick", { multipleBond: "symmetric" });

    // Hidden excited-state overlay (porphyrin ring, bright yellow).
    // Callers can reach it via  mol.component._excitedRep  for animations.
    const excitedRep = comp.addRepresentation("ball+stick", {
      sele:         PORPHYRIN_RING_SELE,
      colorValue:   "#ffee22",
      opacity:      0.95,
      multipleBond: "symmetric",
      visible:      false,
    });
    comp._excitedRep = excitedRep;

    stage.viewer.requestRender();
    return comp;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Load the PDB and add it to the stage.
   * Returns the NGL StructureComponent.  Idempotent: subsequent calls return
   * the existing component without reloading.
   */
  async function load() {
    if (_component) return _component;
    _component = await _loadFromServer();
    return _component;
  }

  /**
   * Make the component visible.
   * Safe to call before load() completes – silently ignored in that case.
   */
  function display() {
    if (!_component) return;
    _component.setVisibility(true);
    stage.viewer.requestRender();
  }

  /**
   * Fully remove the component from the NGL stage and free its GPU geometry.
   * After this call mol.component is null; call restore() to bring it back.
   */
  function remove() {
    if (!_component) return;
    stage.removeComponent(_component);
    _component = null;
  }

  /**
   * Restore the molecule after a remove().
   * - If the component was removed: reloads from the server and returns it.
   * - If the component still exists (e.g. just hidden): calls display() instead.
   * Returns a Promise that resolves to the NGL StructureComponent.
   */
  async function restore() {
    if (_component) {
      display();
      return _component;
    }
    _component = await _loadFromServer();
    return _component;
  }

  // ── Exported object ────────────────────────────────────────────────────────

  return {
    load,
    display,
    remove,
    restore,
    /** Direct access to the underlying NGL StructureComponent (may be null). */
    get component() { return _component; },
  };
}
