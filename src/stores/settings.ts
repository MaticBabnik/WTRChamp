import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface ISettings {
  gameplay: {
    videoBackgrounds: boolean,
    backgroundDim: number
  },
  controls: {
    sensitivity: number,
    restart: string,
    play: string,
  },
  volume: {
    master: number,
    music: number,
    sfx: number
  }
}

const DEFAULTS: ISettings = {
  gameplay: {
    videoBackgrounds: false,
    backgroundDim: 30
  },
  controls: {
    restart: 'r',
    play: 'z',
    sensitivity: 1.0,
  },
  volume: {
    master: 100,
    music: 100,
    sfx: 100
  }
};

export const useSettingsStore = defineStore('settings', {
  state() {
    let settings: ISettings | null = null;

    try {
      const d = localStorage.getItem('settings');
      console.log('Got settings');
      settings = JSON.parse(d ?? '');
      console.log('Parsed settins');
    } catch {
      // if loading fails we write the defaults
      console.log('ohno its broken')
      localStorage.setItem('settings', JSON.stringify(settings = DEFAULTS));
    }

    return settings as ISettings;
  },
  actions: {
    save () {
      localStorage.setItem('settings', JSON.stringify(this.$state));
    }
  }
})
