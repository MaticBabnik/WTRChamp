<script lang="ts" setup>
import { ScreenName } from "@/grr";
import { useSettingsStore } from "@/stores/settings";
import { ref } from "vue";
import { type IGameStartInfo, BGType, init } from "./Game/init";
import MainMenu from "./MainMenu.vue";
const SN = ScreenName;
const emit = defineEmits<{
    (e: "switch", c: ScreenName, props: Record<string, any>): void;
}>();

const props = defineProps<{
    map: string
}>();

function tearDown() {
    console.log("Game torn down");
}

defineExpose({
    tearDown,
});

const settings = useSettingsStore();
const gsi = ref<IGameStartInfo | null>(null);
const canvas2d = ref<HTMLCanvasElement | null>(null);

async function main() {
    gsi.value = await init(props.map);
}


main();
</script>

<template>
    <main id="game" v-if="gsi">
        <div class="overlay"></div>
        <div class="overlay"></div>

        <canvas ref="canvas2d"></canvas>

        <video v-if="gsi.bgType == BGType.Video && settings.gameplay.videoBackgrounds"
            src="/beatmaps/wantyougone/bg.mp4" autoplay></video>
        <img v-else-if="gsi.bgType == BGType.Image" src="/beatmaps/TraitorsRequiem/bg.png">
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
