<script lang="ts" setup>
import { ref } from "vue";

import GoofyButton from "./UI/GoofyButton.vue";
import MapCard from "./UI/MapCard.vue";
import { useMapStore } from "@/stores/maps";
import { computed } from "vue";

import { ScreenName } from "@/grr";
import { useScoresStore } from "@/stores/scores";
const SN = ScreenName;

const emit = defineEmits<{
    (e: "switch", c: ScreenName, props: Record<string, any>): void;
}>();

const props = defineProps<{
    focus?: string;
}>();

const maps = useMapStore();
if (Object.keys(maps.maps).length == 0) {
    maps.fetchMaps();
}

const scores = useScoresStore();

const selectedKey = ref(props.focus ?? "");

const selectedMap = computed(() => {
    return maps.maps[selectedKey.value];
});
const selectedScores = computed(() => {
    return scores.scores[selectedKey.value] ?? [];
});
</script>

<template>
    <main id="song-select">
        <div class="grid">
            <div id="top">
                <h1 class="title">Play...</h1>
                <GoofyButton auto-size @click="maps.fetchMaps()">
                    Refresh
                </GoofyButton>
                <div style="flex: 1"></div>
                <GoofyButton auto-size @click="emit('switch', SN.MainMenu, {})">Back</GoofyButton>
            </div>
            <div id="list">
                <MapCard v-for="(map, k) in maps.maps" :key="k" :class="{ selected: k == selectedKey }" :name="map.name"
                    :author="map.author" @click="selectedKey = k" />
            </div>
            <div id="info">
                <div class="details" v-if="selectedKey != ''">
                    <span class="field">Title: </span>
                    <span class="title">{{ selectedMap?.name }}</span>
                    <span class="field">Author: </span>
                    <span class="author">{{ selectedMap?.author }}</span>
                    <span class="field">Year: </span>
                    <span class="year">{{ selectedMap?.year }}</span>
                    <span class="field">Genre: </span>
                    <span class="genre">{{ selectedMap?.genre }}</span>
                    <span class="field">Description: </span>
                    <p class="description">{{ selectedMap?.description }}</p>
                    <!-- <span class="field">Preview:</span> -->
                    <!-- <audio controls :src="`/beatmaps/${selectedKey}/song.ogg`"></audio> -->
                    <span class="field">Scores:</span>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                        <tr v-for="(s, k) in selectedScores" :key="k">
                            <td>{{ s.name }}</td>
                            <td>{{ s.score }}</td>
                        </tr>
                    </table>
                </div>
                <GoofyButton v-if="selectedKey != ''" @click="emit('switch', SN.Game, { map: selectedKey })">Play
                </GoofyButton>
            </div>
        </div>
    </main>
</template>

<style lang="less">
#song-select {
    display: flex;
    justify-content: stretch;
    align-items: stretch;

    .grid {
        margin: 30px;
        display: grid;
        width: 100%;
        gap: 10px;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr auto;
        grid-template-areas: "top top" "list info";

        #top {
            grid-area: top;
            display: flex;
            flex-direction: row;
            gap: 10px;
        }

        #list {
            grid-area: list;
            overflow-y: scroll;
            display: flex;
            flex-direction: column;

            .selected {
                box-shadow: 0 0 10px red inset;
            }
        }

        #info {
            &.hide {
                * {
                    display: none !important;
                }
            }

            overflow-y: auto;
            grid-area: info;
            width: 500px;
            padding: 10px;
            border-radius: 10px;
            background-color: #520c0c;

            display: flex;
            flex-direction: column;

            .details {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;

                overflow-y: scroll;

                span {
                    color: white;
                }

                p {
                    margin: 0;
                    text-align: center;
                }

                .field {
                    color: #edcb16;
                    font-weight: bold;
                    margin-top: 10px;
                }

                .title {
                    font-family: "Orbitron";
                    font-size: 32px;
                    font-weight: bolder;
                    display: block;
                    margin-bottom: 10px;
                    text-align: center;
                }

                table {
                    border-collapse: collapse;
                    margin-top: 10px;
                    width: 75%;

                    td,
                    th {
                        border: 2px solid white;
                        color: white;
                        font-size: 24px;
                        padding: 5px;
                        width: 50%;
                    }

                    td:nth-child(2) {
                        text-align: right;
                    }
                }

                audio {
                    margin: 10px;
                }
            }
        }
    }
}
</style>
