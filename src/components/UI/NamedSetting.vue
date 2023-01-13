<script setup lang="ts">
const props = defineProps<{ name: string }>();
</script>

<template>
    <div class="setting">
        <span class="name">{{ props.name }}</span>
        <div class="value">
            <slot> </slot>
        </div>
    </div>
</template>

<style lang="less">
.setting {
    display: flex;
    flex-direction: row;

    background-color: #520c0c;
    margin: 5px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    overflow: hidden;

    &:hover {
        outline: 1px solid #bd3e22;
    }

    .name {
        padding: 6px;
        flex: 1;
    }

    .value {
        background-color: #5e1717;
        width: 30%;
    }
}
</style>
