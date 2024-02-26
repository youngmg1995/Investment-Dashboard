/**
 * Random helper functions, classes, etc. used throughout App.
 */

/* *********************************  ********************************* */
/*                                IMPORTS
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                 TYPES
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                PARAMS
/* *********************************  ********************************* */



/* *********************************  ********************************* */
/*                                EXPORTS
/* *********************************  ********************************* */

/**
 * Inefficient class for keeping an array sorted.
 */
export class SortedArray<T> implements Iterable<T> {
  private data: T[];
  private comparator?: (a: T, b:T) => number;
  public length: number;

  constructor(comparator?: (a: T, b:T) => number) {
    this.data = [];
    this.comparator = comparator;
    this.length = 0;
  }

  [key: number]: T;
  public get(i: number): T {
    return this.data[i];
  }

  public size(): number {
    return this.data.length;
  }

  public push(t: T): number {
    const l = this.data.length
    let i;
    for (i=0; i<l; i++) {
      if (this.comparator === undefined) {
        if (this.data[i] > t) break;
      } else {
        if (this.comparator(this.data[i], t) > 0) break;
      }
    }
    this.data = this.data.slice(0,i)
      .concat([t].concat(this.data.slice(i,l)));
    this.length = this.data.length
    return i;
  }

  public [Symbol.iterator]() {
    let i = 0;
    return {
        next: () => {
            return {
                done: i >= this.data.length,
                value: this.data[i++]
            }
        }
    }
}
}



/* *********************************  ********************************* */
/*                                HELPERS
/* *********************************  ********************************* */


