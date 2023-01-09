import { defineStore } from 'pinia'
import Wad from 'web-audio-daw';
import { useSettingsStore } from './settings';

const h_ = () => new Wad({ source: 'sine' });
type tWad = ReturnType<typeof h_>; // `Wad` is a value and typeof `Wad` is wrong

export const useAudioStore = defineStore('audio', {
    state() {
        const master = new Wad.Poly({});

        const a = new Wad({ source: 'noise' });

        return {
            master,
            sfx: {} as Record<string, tWad>,
            music: {} as Record<string, tWad>
        };
    },
    actions: {
        init() {
            const settings = useSettingsStore();
            settings.$subscribe((mut, state) => {
                this.master.setVolume(state.volume.master / 100);

                for (let wk in this.sfx) {
                    this.sfx[wk].setVolume(state.volume.sfx / 100)
                }

                for (let wk in this.music) {
                    this.music[wk].setVolume(state.volume.music / 100)
                }
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
            wad.setVolume(settings.volume[type] / 100);
            return wad;
        }
    }
})
