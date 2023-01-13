<script setup lang="ts">
import { computed } from "vue";

interface Props {
    name: string;
    value: number;
    unit?: string;
    min?: number;
    max?: number;
    step?: number;
}

const props = withDefaults(defineProps<Props>(), {
    unit: "",
    min: 0,
    max: 100,
    step: 1,
});

defineEmits<{
    (e: "update:value", v: number): void;
}>();

const progress = computed(() => {
    return {
        width: `${
            ((props.value - props.min) / (props.max - props.min)) * 100
        }%`,
    };
});

const decimalPlaces = computed(() => {
    return (props.step.toString().split(".")[1] ?? "").length;
});

const label = computed(() => {
    const n = props.value.toFixed(decimalPlaces.value);
    return n + props.unit;
});
</script>

<template>
    <div class="range">
        <div class="bg" :style="progress"></div>
        <span class="disp">{{ label }}</span>
        <input
            type="range"
            :name="props.name"
            :id="props.name"
            :min="props.min"
            :max="props.max"
            :step="props.step"
            :value="props.value"
            @input="
                $emit(
                    'update:value',
                    Number(($event.target as any as HTMLInputElement).value)
                )
            "
        />
    </div>
</template>

<style lang="less">
.range {
    position: relative;

    &.stretch {
        width: 100%;
        height: 100%;
        margin: 0 !important;
    }

    .disp {
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);

        text-shadow: 0px 0px 5px #000;
        margin: 0 !important;
    }

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;

        width: 50%;
        background-color: red;
        margin: 0 !important;
    }

    input[type="range"] {
        opacity: 0%;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        background: transparent;
        border-radius: 0;
        height: 0;
        width: 100%;
    }

    /* slider thumb */
    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        margin-top: -18px;
        height: 36px;
        border-radius: 4px;
        width: 0;
        background-color: #ff0000;
    }

    input[type="range"]::-moz-range-track {
        background-color: none;
        height: 0;
    }

    input[type="range"]::-moz-range-thumb {
        background-color: #ff0000;
        border: none;
        border-radius: 4px;
        height: 100%;
        width: 0;
    }

    input[type="range"]:focus {
        outline: none;
    }

    input[type="range"] {
        appearance: none;
        background: transparent;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0 !important;
    }
}
</style>
