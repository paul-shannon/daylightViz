/**
 * molecule.js
 *
 * Base class for NGL molecules with four core behaviors:
 *   load()     – fetch PDB, build representations, make visible.
 *                Idempotent: returns existing component on repeat calls.
 *   display()  – setVisibility(true).  Safe to call anytime.
 *   remove()   – stage.removeComponent() — drops geometry, frees GPU memory.
 *                this.component becomes null.
 *   restore()  – if component was removed: reloads from server.
 *                if component exists but hidden: calls display().
 *
 * Subclass by overriding:
 *   buildRepresentations(comp)  – add NGL representations to the component.
 *   afterLoad(comp)             – position, rotate, post-load setup.
 *
 * Usage
 * -----
 *   import { Molecule } from './molecule.js';
 *
 *   class MyMol extends Molecule {
 *     buildRepresentations(comp) {
 *       comp.addRepresentation("ball+stick");
 *     }
 *     afterLoad(comp) {
 *       comp.setPosition([10, 0, 0]);
 *     }
 *   }
 *
 *   const mol = new MyMol(stage, "http://host/pdb/foo.pdb");
 *   await mol.load();
 *   mol.remove();
 *   await mol.restore();
 */

export class Molecule {
  /**
   * @param {NGL.Stage} stage
   * @param {string}    url    – full URL to the PDB file
   */
  constructor(stage, url) {
    this.stage     = stage;
    this.url       = url;
    this.component = null;   // NGL StructureComponent, null when not on stage
  }

  // ── Override in subclasses ─────────────────────────────────────────────────

  /**
   * Add NGL representations to the freshly loaded component.
   * Called once per load / restore cycle, before afterLoad().
   * Default: plain ball+stick.
   */
  buildRepresentations(comp) {
    comp.addRepresentation("ball+stick", { multipleBond: "symmetric" });
  }

  /**
   * Called after representations are built.
   * Use for setPosition, setRotation, extra setup, etc.
   * Default: no-op.
   */
  afterLoad(comp) {}   // eslint-disable-line no-unused-vars

  // ── Core behaviors ─────────────────────────────────────────────────────────

  /** Fetch PDB, build reps, run afterLoad.  Idempotent. */
  async load() {
    if (this.component) return this.component;
    this.component = await this.stage.loadFile(this.url);
    this.buildRepresentations(this.component);
    this.afterLoad(this.component);
    this.stage.viewer.requestRender();
    return this.component;
  }

  /** Make the component visible. */
  display() {
    if (!this.component) return;
    this.component.setVisibility(true);
    this.stage.viewer.requestRender();
  }

  /** Fully remove from stage and free GPU geometry. */
  remove() {
    if (!this.component) return;
    this.stage.removeComponent(this.component);
    this.component = null;
  }

  /** Re-load if removed; otherwise just show. */
  async restore() {
    if (this.component) {
      this.display();
      return this.component;
    }
    this.component = await this.stage.loadFile(this.url);
    this.buildRepresentations(this.component);
    this.afterLoad(this.component);
    this.stage.viewer.requestRender();
    return this.component;
  }
}
