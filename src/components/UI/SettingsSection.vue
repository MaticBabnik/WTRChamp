<script setup lang="ts">
const props = defineProps<{ name: string }>();

</script>

<template>
    <div class="settings-section">
        <span class="s-header">{{ props.name }}</span>
        <slot></slot>
    </div>
</template>

<style lang="less">
.settings-section {
    display: flex;
    flex-direction: column;

    .s-header {
        color: #EDCA16;
        background-color: #3E0412;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 2px solid #EDCA16;
        position: sticky;
        top: 0;
        padding-left: 10px;
        margin-top: 5px;
        z-index: 100;
    }

    &>*:not(.s-header) {
        margin-left: 5px;
    }
}
</style>