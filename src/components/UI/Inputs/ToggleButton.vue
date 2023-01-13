<script setup lang="ts">
interface Props {
    name: string;
    value: boolean;
}
const props = defineProps<Props>();

defineEmits<{
    (e: "update:value", v: boolean): void;
}>();
</script>

<template>
    <div class="toggle">
        <input
            type="checkbox"
            :name="props.name"
            :id="props.name"
            :checked="props.value"
            @input="
                $emit(
                    'update:value',
                    ($event.target as any as HTMLInputElement).checked
                )
            "
        />
        <div class="visual" :class="{ active: props.value }">
            <div class="inner"></div>
        </div>
    </div>
</template>

<style lang="less">
.toggle {
    position: relative;

    &.stretch {
        width: 100%;
        height: 100%;
        margin: 0 !important;
    }

    input[type="checkbox"] {
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
    }

    * {
        transition: 0.1s ease;
    }

    .visual {
        pointer-events: none;

        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);

        width: 50px;
        height: 30px;
        background-color: white;
        border-radius: 15px;

        .inner {
            margin: 4px;
            width: 22px;
            height: 22px;
            border-radius: 100%;
            background-color: red;
        }

        &.active {
            background-color: red;

            .inner {
                position: relative;
                background-color: white;
                left: 20px;
            }
        }

        &:not(.active) {
            // idk why this was needed
            background-color: white;

            .inner {
                position: relative;
                background-color: red;
                left: 0;
            }
        }
    }
}
</style>
