<script lang="ts" setup>
import { ScreenName } from "@/grr";
import { useSettingsStore } from "@/stores/settings";
import { ref, nextTick } from "vue";
import { type IGameStartInfo, BGType, init } from "./Game/init";
import { Game } from "./Game/game";
import type { Song } from "./Game/util/parser";

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
const gsi = ref<IGameStartInfo | null>(null);
const canvas2d = ref<HTMLCanvasElement | null>(null);
let game: Game | null;
let song: Song | null = null;

function create() {
    if (!canvas2d.value || !song) throw "Canvas missing";
    game = new Game(canvas2d.value, settings, song);
    game.addEventListener("restart", restart);
    game.addEventListener("exit", exit);
    game.mainLoop();
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

async function main() {
    ({ song } = gsi.value = await init(props.map));
    await nextTick();
    create();
}

main();
</script>

<template>
    <main id="game" v-if="gsi">
        <video
            v-if="
                gsi.bgType == BGType.Video && settings.gameplay.videoBackgrounds
            "
            :src="gsi.bg"
            autoplay
        ></video>
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
