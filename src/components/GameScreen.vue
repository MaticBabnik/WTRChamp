<script lang="ts" setup>
import { ScreenName } from "@/grr";
import { useSettingsStore } from "@/stores/settings";
import { ref, nextTick } from "vue";
import { type IGameStartInfo, BGType, init } from "./Game/init";
import { Game } from "./Game/game";
import type { Song } from "./Game/util/parser";
import { useAudioStore } from "@/stores/audio";
import { useScoresStore } from "@/stores/scores";

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
const scores = useScoresStore();

const gsi = ref<IGameStartInfo | null>(null);
const canvas2d = ref<HTMLCanvasElement | null>(null);
const videoEl = ref<HTMLVideoElement | null>(null);
const audioEl = ref<HTMLAudioElement | null>(null);

let game: Game | null;
let song: Song | null = null;

async function preload(el: HTMLMediaElement, volume: boolean = false) {
    console.log({ volume });
    el.volume = 0;
    await el.play();
    el.pause();
    el.currentTime = 0;
    if (volume) el.volume = (settings.volume.master / 100) * (settings.volume.music / 100);
}

async function create() {
    const [v, a] = [videoEl.value, audioEl.value];

    if (v) await preload(v);
    if (a) await preload(a, true);

    if (v) v.play();
    if (a) a.play();

    if (!canvas2d.value || !song) throw "Canvas missing";
    game = new Game(canvas2d.value, settings, song, audio);
    game.addEventListener("restart", restart);
    game.addEventListener("exit", exit);
    game.addEventListener("done", done);
    game.startGame();
}

async function restart() {
    game?.destroy();
    game = null;
    await nextTick();
    create();
}

function exit() {
    game?.destroy();
    game = null;
    emit("switch", ScreenName.SongSelect, { focus: props.map });
}

function done() {
    const score = game?.scoreKeeper.Stats;
    if (score)
        scores.addScore(props.map, '(You)', score.score);
    game?.destroy();
    game = null;

    emit("switch", ScreenName.Score, { map: props.map, score });
}

async function main() {
    console.log("Fetching song...");
    ({ song } = gsi.value = await init(props.map));
    await nextTick();
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
