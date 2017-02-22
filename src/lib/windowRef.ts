import { Injectable } from '@angular/core';

function getWindow (): any {
  return window;
}

@Injectable()
export class WindowRefService {
  /**
   * Need to access browser windows object in electron
   * @returns {any}
   */
  get nativeWindow (): any {
    return getWindow();
  }
}
