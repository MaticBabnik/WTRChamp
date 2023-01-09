<script lang="ts" setup>
import GoofyButton from "./UI/GoofyButton.vue";
import Trombone from "./UI/Trombone.vue"

import { ScreenName } from "@/grr";
const SN = ScreenName;

const emit = defineEmits<{
    (e: "switch", c: ScreenName, props: Record<string, any>): void;
}>();

</script>

<template>
    <main class="main-menu">
        <Trombone class="tr" />
        <h1 class="title">WTRChamp</h1>

        <GoofyButton @click="() => emit('switch', SN.SongSelect, {})">Play</GoofyButton>
        <GoofyButton @click="() => emit('switch', SN.Settings, {})">Settings</GoofyButton>
        <GoofyButton @click="() => emit('switch', SN.Credits, {})">Credits</GoofyButton>
    </main>
</template>

<style lang="less">
.main-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    * {
        z-index: 10;
    }

    .tr {
        z-index: 1; //keep the trombone under UI
        transform: rotate(-70deg) translate(-400px, 300px);
    }
}
</style>
