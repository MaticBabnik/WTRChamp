import { defineStore } from 'pinia'
import Wad from 'web-audio-daw';
import { useSettingsStore, type ISettings } from './settings';

const h_ = () => new Wad({ source: 'sine' });
const i_ = () => new Wad.Poly({});
export type tWad = ReturnType<typeof h_>; // `Wad` is a value and typeof `Wad` is wrong
export type tPolyWad = ReturnType<typeof i_>;

export type AudioStore = ReturnType<typeof useAudioStore>;
export const useAudioStore = defineStore('audio', {
    state() {
        const master = new Wad.Poly({});
        return {
            master,
            sfx: {} as Record<string, tWad>,
            music: {} as Record<string, tWad>

        };
    },
    actions: {
        setVolumes(settings: ISettings) {
            this.master.setVolume(settings.volume.master / 100);

            for (const wk in this.sfx) {
                this.sfx[wk].setVolume(settings.volume.sfx / 100)
            }

            for (const wk in this.music) {
                this.music[wk].setVolume(settings.volume.music / 100)
            }
        },
        init() {
            const settings = useSettingsStore();
            settings.$subscribe((mut, state) => {
                this.setVolumes(state);
            });
        },
        registerWad(type: 'sfx' | 'music', name: string, wad: tWad) {
            const settings = useSettingsStore();

            if (this[type][name]) {
                this[type][name].stop();
                this.master.remove(this[type][name]);
                delete this[type][name];
            }

            this.master.add(wad);
            this[type][name] = wad;

            wad.setVolume((wad.volume = settings.volume[type] / 100));

            this.setVolumes(settings.$state);

            return wad;
        }
    }
})
