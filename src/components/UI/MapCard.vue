<script setup lang="ts">
const props = defineProps<{
    name: string;
    author: string;
}>();
</script>
<template>
    <div class="map">
        <h3>{{ props.name }}</h3>
        <span class="bold">Author: </span>
        <span class="author">{{ props.author }}</span>
    </div>
</template>

<style lang="less">
.map {
    background-color: #520c0c;
    border-radius: 10px;
    padding: 10px;
    margin: 0 0 10px 0;

    h3 {
        color: white;
        margin: 5px 0;
        font-size: 24px;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    span {
        color: white;
    }

    .bold {
        color: #edcb16;
        font-weight: bold;
    }

    &:hover {
        background-color: #631111;
    }
}
</style>
