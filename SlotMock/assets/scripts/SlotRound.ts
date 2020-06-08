/* eslint-disable no-param-reassign */

import { SlotResultProps } from './SlotTypes';

export default class SlotRound {
  public static next(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: [],
      equalLines: [],
      equalTile: 0
    };

    const roundRng = Math.random();
    console.log(roundRng);

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
      if (res.equalLines.some(e => e === i)) {
        for (let j = 0; j < reels; ++j) {
          res.reels[j][i] = res.equalTile;
        }
      } else {
        const unequalLine: Array<number> = this.createRandomLine(tiles, reels);
        for (let j = 0; j < reels; ++j) {
          res.reels[j][i] = unequalLine[j];
        }
      }
    }

    return res;
  }

  private static createRandomLine(tiles: number, reels: number): Array<number> {
    const res = [];
    const uniqueValues = [];

    for (let j = 0; j < reels; ++j) {
      res[j] = Math.floor(Math.random() * tiles);
      if (!uniqueValues.some(e => e === res[j])) {
        uniqueValues.push(res[j]);
      }
    }

    if (uniqueValues.length <= 1) {
      const position = Math.floor(Math.random() * this.length);
      const value = Math.floor(Math.random() * this.length);
      res[position] = value;
    }

    return res;
  }

  private static randomLines(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: this.createReel(reels),
      equalLines: [],
      equalTile: -1
    };

    result = this.populateReels(result, tiles, reels);

    return result;
  }

  private static singleJackpot(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: this.createReel(reels),
      equalLines: [Math.floor(Math.random() * 3)],
      equalTile: Math.floor(Math.random() * tiles)
    };

    result = this.populateReels(result, tiles, reels);

    return result;
  }

  private static doubleJackpot(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: this.createReel(reels),
      equalLines: [],
      equalTile: Math.floor(Math.random() * tiles)
    };

    const differentLine = Math.floor(Math.random() * 3);
    for (let i = 0; i < 3; i++) {
      if (i !== differentLine) {
        result.equalLines.push(i);
      }
    }

    result = this.populateReels(result, tiles, reels);

    return result;
  }

  private static tripleJackpot(tiles: number, reels: number): SlotResultProps {
    let result: SlotResultProps = {
      reels: this.createReel(reels),
      equalLines: [],
      equalTile: Math.floor(Math.random() * tiles)
    };

    for (let i = 0; i < 3; ++i) {
      result.equalLines.push(i);
    }

    result = this.populateReels(result, tiles, reels);

    return result;
  }
}
