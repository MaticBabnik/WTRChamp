<script setup lang="ts">
import { ScreenName, type GrrComponent, type GrrState } from "./grr";

import { shallowRef, ref } from "vue";
import { useAudioStore } from "./stores/audio";
import Wad from "web-audio-daw";

const audio = useAudioStore();
audio.init();


//@ts-ignore
const click = audio.registerWad('sfx', 'transition', new Wad({ source: '/sfx/transition.ogg' }));
//@ts-ignore
const bgm = audio.registerWad('music', 'bgm', new Wad({ source: '/sfx/bgm.ogg', loop: true }));
bgm.play();


const cv = ref<GrrComponent | null>(null);
const currentView = shallowRef<GrrState>({
    c: ScreenName.MainMenu,
    props: { tp1: "testprop1" },
});

function switchView(c: ScreenName, props: Record<string, any>) {
    const from = currentView.value.c, to = c;

    console.log({ from, to });

    if (to == ScreenName.Game) bgm.stop();
    if (from == ScreenName.Game && to != ScreenName.Game) {
        document.exitPointerLock();
        bgm.play();
    }

    cv.value?.tearDown?.();
    currentView.value = { c, props };
    click.play();
}
</script>

<template>
    <component ref="cv" :is="currentView.c" v-bind="currentView.props" @switch="switchView" />
</template>
