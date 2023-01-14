<script lang="ts" setup>
import { ScreenName } from "@/grr";
import { useSettingsStore } from "@/stores/settings";
import { ref, nextTick } from "vue";
import { type IGameStartInfo, BGType, init } from "./Game/init";
import { Game } from "./Game/game";
import type { Song } from "./Game/util/parser";
import { useAudioStore, type tWad } from "@/stores/audio";
import Wad from "web-audio-daw";

const emit = defineEmits<{
    (e: "switch", c: ScreenName, props: Record<string, any>): void;
}>();

const props = defineProps<{
    map: string;
}>();

function tearDown() {
    game = null;
    console.log("Game torn down");
}

defineExpose({
    tearDown,
});

const settings = useSettingsStore();
const audio = useAudioStore();
const gsi = ref<IGameStartInfo | null>(null);
const canvas2d = ref<HTMLCanvasElement | null>(null);
const videoEl = ref<HTMLVideoElement | null>(null);
const audioEl = ref<HTMLAudioElement | null>(null);

let game: Game | null;
let song: Song | null = null;

function awaitOnload(el: HTMLMediaElement) {
    console.log(el.readyState);
    if (el.readyState == 4) {
        return;
    }

    return new Promise(resolve => {
        el.addEventListener('load', () => resolve(void 0), { once: true })
        if (el.readyState == 4) resolve(void 0);
    });
}

function create() {
    if (!canvas2d.value || !song) throw "Canvas missing";
    game = new Game(canvas2d.value, settings, song, audio);
    game.addEventListener("restart", restart);
    game.addEventListener("exit", exit);
    game.startGame();
}

function restart() {
    game?.destroy();
    game = null;
    create();
}

function exit() {
    game?.destroy();
    game = null;
    emit("switch", ScreenName.SongSelect, { focus: props.map });
}

async function waitTillPlayable(w: tWad) {
    const vBackup = w.volume;
    w.setVolume(0);
    await w.play();
    w.stop();
    w.setVolume(vBackup);
    return;
}

async function main() {
    console.log("initalizing...");
    ({ song } = gsi.value = await init(props.map));
    await nextTick();
    const songAudio = audio.registerWad('music', 'song', new Wad({ source: gsi.value.audio }));
    // waitTillPlayable(songAudio);
    const [v, a] = [videoEl.value, audioEl.value];

    if (v) {
        console.log("waiting for video");
        await awaitOnload(v);
    }
    if (a) {
        const pr = awaitOnload(a);
        a.volume = 0;
        console.log("waiting for audio");
        await a.play();
        a.pause();
        a.currentTime = 0;
        a.volume = (settings.volume.master / 100) * (settings.volume.music / 100);
        console.log(a.volume);
    }
    if (v) v.play();
    if (a) a.play();
    create();
}

main();
</script>

<template>
    <main id="game" v-if="gsi">
        <audio ref="audioEl" :src="gsi.audio" preload="auto"></audio>
        <video v-if="
            gsi.bgType == BGType.Video && settings.gameplay.videoBackgrounds
        " :src="gsi.bg" ref="videoEl"></video>
        <img v-else-if="gsi.bgType == BGType.Image" :src="gsi.bg" />
        <canvas ref="canvas2d"></canvas>
        <div class="overlay"></div>
        <div class="overlay"></div>
    </main>
    <main id="game-loading" v-else>
        <h1 class="title">Loading...</h1>
    </main>
</template>

<style lang="less">
#game {
    background-color: black;
    position: relative;

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    video,
    img {
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
