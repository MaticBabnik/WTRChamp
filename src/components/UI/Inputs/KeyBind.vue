<script setup lang="ts">
import { computed } from "vue";
import { ref } from "vue";
interface Props {
    name: string;
    value: string;
}
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: "update:value", v: string): void;
}>();

const bound = computed(() => props.value != "unbound");
const active = ref(false);

function setCatch(v: boolean) {
    active.value = v;
    if (v) {
        window.addEventListener("keydown", tryBind);
    } else {
        window.removeEventListener("keydown", tryBind);
    }
}

function tryBind(e: KeyboardEvent) {
    emit("update:value", e.code);
    e.preventDefault();
}
</script>

<template>
    <div class="keybind" :class="{ active }">
        <div
            class="bind"
            :class="{ bound }"
            @mouseenter="() => setCatch(true)"
            @mouseleave="() => setCatch(false)"
            @keydown="tryBind"
        >
            &lt;{{ value == "unbound" && active ? "Press a key" : value }}&gt;
        </div>
        <button
            class="unbind"
            :disabled="!bound"
            @click="emit('update:value', 'unbound')"
        >
            X
        </button>
    </div>
</template>

<style lang="less">
.keybind {
    position: relative;
    display: flex;
    align-items: center;
    box-shadow: red 0 0 0px inset;
    transition: box-shadow 0.1s ease;

    &.active {
        box-shadow: red 0 0 20px inset;
    }

    &.stretch {
        width: 100%;
        height: 100%;
        margin: 0 !important;
    }

    &.active .bind {
        color: yellow !important;
    }

    .bind {
        flex: 1;
        text-align: center;
        color: #aaa;

        &.bound {
            color: #fff;
        }
    }

    .unbind {
        height: 100%;
        aspect-ratio: 1;

        outline: none;
        border: none;
        background-color: transparent;
        color: red;
        font-weight: bold;

        &:disabled {
            color: #777;
        }
    }
}
</style>
