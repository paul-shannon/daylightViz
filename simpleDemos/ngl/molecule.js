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

  static  DEG = Math.PI / 180;

  constructor(stage, url) {
    this.stage     = stage;
    this.url       = url;
    this.component = null;   // NGL StructureComponent, null when not on stage
    this.position  = null;
  }

  buildRepresentations() {
    this.component.addRepresentation("ball+stick", { multipleBond: "symmetric" });
    }

  afterLoad() {}

  async load() {
    console.log("--- entering molecule::load")
    if (this.component) return this.component;
    this.component = await this.stage.loadFile(this.url);
    return this.component;
    }

  setLocation(x, y, z){
     this.position = [x, y, z]
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

  remove() {
    if (!this.component) return;
    this.stage.removeComponent(this.component);
    this.component = null;
    }

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
    } // restore

//---------------------------------------------------------------------------
   move(destination, frames, pause, nextOperation){

      let mFrame = 0;
      const mSteps = frames;
      const startX = this.position[0]
      const startY = this.position[1]
      const endX = destination[0]
      const endY = destination[1]
      var deltaX = (endX - startX)/mSteps;
      var deltaY = (endY - startY)/mSteps;
      var i = 0;
      var localComp = this.component;
      var localStage = this.stage;
      var complete = false;
      function step() {
         if (i >= mSteps) {
           complete = true;
           nextOperation()
           return;
           }
         else {
            const newX = startX + (i * deltaX)
            const newY = startY + (i * deltaY)
            localComp.setPosition([newX, newY, 0]);
            localStage.viewer.requestRender();
            setTimeout(step, pause);
            i++;
            } // else
           } // function step
        step()
    } // move
//---------------------------------------------------------------------------

} // class Molecule
