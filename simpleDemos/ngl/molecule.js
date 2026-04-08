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
 *   buildRepresentations()  – add NGL representations via this.component.
 *   afterLoad()             – position, rotate, post-load setup via this.component.
 *
 * Usage
 * -----
 *   import { Molecule } from './molecule.js';
 *
 *   class MyMol extends Molecule {
 *     buildRepresentations() {
 *       this.component.addRepresentation("ball+stick");
 *     }
 *     afterLoad() {
 *       this.component.setPosition([10, 0, 0]);
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

  /** Add NGL representations via this.component.  Default: plain ball+stick. */
  buildRepresentations() {
    console.log(" ---  molecule::buildRepresentations")
    this.component.addRepresentation("ball+stick", { multipleBond: "symmetric" });
  }

  /** Position, rotate, or otherwise configure this.component after load.  Default: no-op. */
  afterLoad() {}

  // ── Core behaviors ─────────────────────────────────────────────────────────

  /** Fetch PDB, build reps, run afterLoad.  Idempotent. */
  async load() {
    console.log("--- entering molecule::load")
    if (this.component) return this.component;
    this.component = await this.stage.loadFile(this.url);
    return this.component;
    }

  show() {
    if (!this.component) return;
    this.component.setVisibility(true);
    this.stage.viewer.requestRender();
    }

  hide() {
    if (!this.component) return;
    this.component.setVisibility(false);
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
    this.buildRepresentations();
    this.afterLoad();
    this.stage.viewer.requestRender();
    return this.component;
  }
}
