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
    videoBackgrounds: true,
    backgroundDim: 35,
    timeWindow: 3_000
  },
  controls: {
    restart: 'KeyR',
    play: 'KeyZ',
    exit: 'KeyQ',
    sensitivity: 1.0,
  },
  volume: {
    master: 50,
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
      const d = localStorage.getItem('settings2');
      settings = JSON.parse(d ?? '');
      console.log('Read settings from localstorage');
    } catch {
      // if loading fails we write the defaults
      console.warn('Settings were broken, overwriting')
      localStorage.setItem('settings2', JSON.stringify(settings = DEFAULTS));
    }
    defaultsDeep(settings, DEFAULTS); //merge with defaults just in case
    return settings as ISettings;
  },
  actions: {
    save() {
      localStorage.setItem('settings2', JSON.stringify(this.$state));
    }
  }
})