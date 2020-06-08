/* eslint-disable no-param-reassign */

import { SlotResultProps } from './SlotTypes';

export default class SlotRound {
  public static next(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: [],
      jackpotLines: [],
      jackpotTile: 0
    };

    const roundRng = Math.random();

    if (roundRng <= 0.5) {
      result = this.randomLines(tiles, reels);
    } else if (roundRng <= 0.83) {
      result = this.singleJackpot(tiles, reels);
    } else if (roundRng <= 0.93) {
      result = this.doubleJackpot(tiles, reels);
    } else {
      result = this.tripleJackpot(tiles, reels);
    }

    return result;
  }

  private static createReel(reels: number): Array<Array<number>> {
    const result = [];

    for (let i = 0; i < reels; i += 1) {
      result.push([]);
    }

    return result;
  }

  private static populateReels(
    result: SlotResultProps,
    tiles: number,
    reels: number
  ): SlotResultProps {
    const res = result;

    for (let i = 0; i < 3; ++i) {
      if (res.jackpotLines.some(e => e === i)) {
        for (let j = 0; j < reels; ++j) {
          res.reels[j][i] = res.jackpotTile;
        }
      } else {
        const differentTile: Array<number> = this.createDifferentLine(
          tiles,
          reels
        );
        for (let j = 0; j < reels; ++j) {
          res.reels[j][i] = differentTile[j];
        }
      }
    }

    return res;
  }

  private static createDifferentLine(
    tiles: number,
    reels: number
  ): Array<number> {
    const res = [];
    const diff = [];

    for (let j = 0; j < reels; ++j) {
      res[j] = Math.floor(Math.random() * tiles);
      if (!diff.some(e => e === res[j])) {
        diff.push(res[j]);
      }
    }

    if (diff.length <= 1) {
      const position = Math.floor(Math.random() * this.length);
      const value = Math.floor(Math.random() * this.length);
      res[position] = value;
    }

    return res;
  }

  private static randomLines(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: this.createReel(reels),
      jackpotLines: [],
      jackpotTile: null
    };

    result = this.populateReels(result, tiles, reels);

    return result;
  }

  private static singleJackpot(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: this.createReel(reels),
      jackpotLines: [1],
      jackpotTile: Math.floor(Math.random() * tiles)
    };

    result = this.populateReels(result, tiles, reels);

    return result;
  }

  private static doubleJackpot(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: this.createReel(reels),
      jackpotLines: [1],
      jackpotTile: Math.floor(Math.random() * tiles)
    };

    result.jackpotLines.push(Math.floor(Math.random() * 2) <= 1 ? 0 : 1);

    result = this.populateReels(result, tiles, reels);

    return result;
  }

  private static tripleJackpot(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: this.createReel(reels),
      jackpotLines: [0, 1, 2],
      jackpotTile: Math.floor(Math.random() * tiles)
    };

    result = this.populateReels(result, tiles, reels);

    return result;
  }
}
