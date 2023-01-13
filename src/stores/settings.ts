import defaultsDeep from "lodash/defaultsDeep"
import { defineStore } from 'pinia'

export interface ISettings {
  gameplay: {
    videoBackgrounds: boolean,
    backgroundDim: number,
    timeWindow: number
  },
  controls: {
    sensitivity: number,
    restart: string,
    play: string,
    exit: string
  },
  volume: {
    master: number,
    music: number,
    sfx: number
  },
  developer: {
    debugHitbox: boolean
  }
}

const DEFAULTS: ISettings = {
  gameplay: {
    videoBackgrounds: false,
    backgroundDim: 30,
    timeWindow: 10_000
  },
  controls: {
    restart: 'r',
    play: 'z',
    exit: 'Escape',
    sensitivity: 1.0,
  },
  volume: {
    master: 100,
    music: 100,
    sfx: 100
  },
  developer: {
    debugHitbox: false,
  }
};

export const useSettingsStore = defineStore('settings', {
  state() {
    let settings: ISettings | null = null;
    try {
      const d = localStorage.getItem('settings');
      settings = JSON.parse(d ?? '');
    } catch {
      // if loading fails we write the defaults
      console.log('Settings were broken, overwriting')
      localStorage.setItem('settings', JSON.stringify(settings = DEFAULTS));
    }
    defaultsDeep(settings, DEFAULTS); //merge with defaults just in case
    return settings as ISettings;
  },
  actions: {
    save() {
      localStorage.setItem('settings', JSON.stringify(this.$state));
    }
  }
})