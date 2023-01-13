<script setup lang="ts">
const props = defineProps<{
    autoSize?: boolean;
}>();

const emit = defineEmits<{
    (e: "click"): void;
}>();
</script>

<template>
    <button
        class="btn-goofy"
        :class="{ fsize: !props.autoSize }"
        @click="() => emit('click')"
    >
        <slot></slot>
    </button>
</template>

<style lang="less">
@button-bg: #640c0c;
@button-bg-f: #bd3e22;
@button-fg: white;
@button-shadow: #0004;
@button-sx: 3px;
@button-sy: 5px;

.btn-goofy {
    border: none;
    outline: none;

    color: white;
    background-color: @button-bg;

    font-size: 36px;
    font-weight: 900;
    font-family: "Open Sans";

    margin: 8px;
    padding: 18px;
    border-radius: 16px;

    &.fsize {
        min-width: 300px;
    }

    box-shadow: calc(@button-sx*2) calc(@button-sy*2) 0px @button-shadow;

    &:hover {
        transition: 0.1s linear;

        background-color: @button-bg-f;

        box-shadow: @button-sx @button-sy 0px @button-shadow;
        transform: translate(@button-sx, @button-sy);
    }
}
</style>
