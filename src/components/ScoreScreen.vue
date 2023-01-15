<script lang="ts" setup>
import GoofyButton from "./UI/GoofyButton.vue";
import { ScreenName } from "@/grr";
import type { ScoreData } from "./Game/score";
import { useMapStore } from "@/stores/maps";
import { computed } from "vue"

const maps = useMapStore();
const SN = ScreenName;

const emit = defineEmits<{
    (e: "switch", c: ScreenName, props: Record<string, any>): void;
}>();

const props = defineProps<{
    map: string;
    score: ScoreData;
}>();

const songData = computed(() => {
    return maps.maps[props.map];
})


</script>

<template>
    <main class="score">
        <h1 class="title">Song completed</h1>
        <h2 class="subtitle">{{ songData.shortName }}</h2>

        <div class="score-breakdown">
            <h1>Score: <span>{{ score.score }}</span></h1>
            <h1>Max combo: <span>{{ score.maxCombo }}</span></h1>
            <table>
                <tr>
                    <td>Perfect</td>
                    <td>{{ score.hitMap.Perfect }}</td>
                </tr>
                <tr>
                    <td>Good</td>
                    <td>{{ score.hitMap.Good }}</td>
                </tr>
                <tr>
                    <td>Okay</td>
                    <td>{{ score.hitMap.Okay }}</td>
                </tr>
                <tr>
                    <td>Miss</td>
                    <td>{{ score.hitMap.Miss }}</td>
                </tr>
            </table>

            <GoofyButton @click="() => emit('switch', SN.SongSelect, { focus: props.map })">
                Back
            </GoofyButton>
        </div>
    </main>
</template>

<style lang="less">
.score {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .score-breakdown {
        margin-top: 10px;
        padding: 10px;
        border-radius: 10px;
        background-color: #520c0c;

        display: flex;
        flex-direction: column;

        h1 {
            color: white;
            font-size: 36px;
            margin: 0 0 5px 0;
            span {
                float: right;
                text-align: right;
                font-size: 36px;
                color: #EDCB16;
                font-family: 'Orbitron';
            }
        }

        table {
            border-collapse: collapse;
            td {
                border: 2px solid white;
                color: white;
                font-size: 24px;
                padding: 5px;
                width: 50%;
                &:nth-child(2) {
                    text-align: right;
                }
            }
        }
    }
}
</style>
