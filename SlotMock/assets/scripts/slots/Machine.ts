import Aux from '../SlotEnum';
import { SlotResultProps } from '../SlotTypes';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Machine extends cc.Component {
  @property(cc.Node)
  public button: cc.Node = null;

  @property(cc.Prefab)
  public _reelPrefab = null;

  @property({ type: cc.Prefab })
  get reelPrefab(): cc.Prefab {
    return this._reelPrefab;
  }

  set reelPrefab(newPrefab: cc.Prefab) {
    this._reelPrefab = newPrefab;
    this.node.removeAllChildren();

    if (newPrefab !== null) {
      this.createMachine();
    }
  }

  @property({ type: cc.Integer })
  public _numberOfReels = 3;

  @property({ type: cc.Integer, range: [3, 6], slide: true })
  get numberOfReels(): number {
    return this._numberOfReels;
  }

  set numberOfReels(newNumber: number) {
    this._numberOfReels = newNumber;

    if (this.reelPrefab !== null) {
      this.createMachine();
    }
  }

  @property({ type: cc.Integer })
  public _numberOfTiles = 30;

  @property({ type: cc.Integer, range: [5, 30], slide: true })
  get numberOfTiles(): number {
    return this._numberOfTiles;
  }

  set numberOfTiles(newNumber: number) {
    this._numberOfTiles = newNumber;
  }

  private reels = [];

  public spinning = false;

  createMachine(): void {
    this.node.destroyAllChildren();
    this.reels = [];

    let newReel: cc.Node;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      newReel = cc.instantiate(this.reelPrefab);
      this.node.addChild(newReel);
      this.reels[i] = newReel;

      const reelScript = newReel.getComponent('Reel');
      reelScript.shuffle();
      reelScript.reelAnchor.getComponent(cc.Layout).enabled = false;
    }

    this.node.getComponent(cc.Widget).updateAlignment();
  }

  spin(): void {
    this.spinning = true;
    this.button.getChildByName('Label').getComponent(cc.Label).string = 'STOP';
    this.glow();

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i].getComponent('Reel');

      if (i % 2) {
        theReel.spinDirection = Aux.Direction.Down;
      } else {
        theReel.spinDirection = Aux.Direction.Up;
      }

      theReel.doSpin(0.03 * i);
    }
  }

  lock(): void {
    this.button.getComponent(cc.Button).interactable = false;
  }

  stop(result: SlotResultProps = null): void {
    setTimeout(() => {
      this.spinning = false;
      this.button.getComponent(cc.Button).interactable = true;
      this.button.getChildByName('Label').getComponent(cc.Label).string =
        'SPIN';
    }, 2500);

    const rngMod = Math.random() / 2;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
      const theReel = this.reels[i].getComponent('Reel');

      setTimeout(() => {
        theReel.readyStop(result.reels[i]);
        this.glow(result, theReel);
      }, spinDelay * 1000);
    }
  }

  glow(result?: SlotResultProps, reel?: any): void {
    let reelTiles: Array<cc.Node> = [];

    if (result && result.jackpotLines.length > 0) {
      reelTiles = reel.node.getChildByName('In').getChildren();

      for (let j = 0; j < reelTiles.length; j++) {
        if (result.jackpotLines.some(e => e + 1 === j)) {
          reelTiles[j]
            .getChildByName('Spine')
            .getComponent('sp.Skeleton').animation = 'loop';
        }
      }
    } else {
      for (let i = 0; i < this.reels.length; i++) {
        reelTiles = this.reels[i].getChildByName('In').getChildren();

        for (let j = 0; j < reelTiles.length; j++) {
          reelTiles[i]
            .getChildByName('Spine')
            .getComponent('sp.Skeleton').animation = null;
        }
      }
    }
  }
}
