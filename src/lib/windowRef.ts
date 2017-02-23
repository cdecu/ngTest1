import { Injectable } from '@angular/core';

function getWindow (): any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class WindowRef {
  /**
   * Need to access browser windows object in electron
   * @returns {any}
   */
  get nativeWindow (): any {
    return getWindow();
  }
}
