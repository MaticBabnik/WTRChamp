<script lang="ts" setup>
import GoofyButton from "./UI/GoofyButton.vue";

import { ScreenName } from "@/grr";
const SN = ScreenName;

const emit = defineEmits<{
    (e: "switch", c: ScreenName, props: Record<string, any>): void;
}>();
</script>

<template>
    <main class="credits">
        <h2 class="subtitle">Matic Babnik</h2>
        <h1 class="title">WTRChamp</h1>
        <p>
            A FOSS TromboneChamp clone made for a school project.
            <br /><br />
            If you are wondering, WTR stands for Web TRombone
        </p>
        <a href="https://babnik.io/">Website</a>
        <a href="https://github.com/MaticBabnik">Github</a>

        <GoofyButton
            class="corner"
            auto-size
            @click="() => emit('switch', SN.MainMenu, {})"
            >Back</GoofyButton
        >
    </main>
</template>

<style lang="less">
.credits {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .corner {
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
</style>
