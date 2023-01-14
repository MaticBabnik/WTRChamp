<script lang="ts" setup>
import Range from "./UI/Inputs/RangeSlider.vue";
import Toggle from "./UI/Inputs/ToggleButton.vue";
import KeyBind from "./UI/Inputs/KeyBind.vue";

import Setting from "./UI/NamedSetting.vue";
import GoofyButton from "./UI/GoofyButton.vue";
import SettingsSection from "./UI/SettingsSection.vue";

import { useSettingsStore } from "@/stores/settings";

import { ScreenName } from "@/grr";
const SN = ScreenName;

const emit = defineEmits<{
    (e: "switch", c: ScreenName, props: Record<string, any>): void;
}>();

const settings = useSettingsStore();

function tearDown() {
    console.log("Saving settings");
    settings.save();
}

defineExpose({ tearDown });

function clear() {
    if (!confirm("Clear localStorage")) return;

    localStorage.clear();
}
</script>

<template>
    <main class="settings">
        <div class="main-grid">
            <h1 class="title" id="title">Settings</h1>
            <GoofyButton
                class="corner"
                id="back"
                auto-size
                @click="() => emit('switch', SN.MainMenu, {})"
            >
                Back
            </GoofyButton>
            <div id="settings">
                <SettingsSection name="Gameplay">
                    <Setting name="Video backgrounds">
                        <Toggle
                            class="stretch"
                            name="s-g-video"
                            v-model:value="settings.gameplay.videoBackgrounds"
                        />
                    </Setting>
                    <Setting name="Background dim">
                        <Range
                            class="stretch"
                            name="s-g-dim"
                            v-model:value="settings.gameplay.backgroundDim"
                            unit="%"
                        />
                    </Setting>
                    <Setting name="Time window">
                        <Range
                            class="stretch"
                            name="s-g-tw"
                            v-model:value="settings.gameplay.timeWindow"
                            unit="ms"
                            :min="1000"
                            :max="5000"
                            :step="500"
                        />
                    </Setting>
                </SettingsSection>

                <SettingsSection name="Controls">
                    <Setting name="Play">
                        <KeyBind
                            class="stretch"
                            name="s-c-play"
                            v-model:value="settings.controls.play"
                        />
                    </Setting>
                    <Setting name="Restart">
                        <KeyBind
                            class="stretch"
                            name="s-c-restart"
                            v-model:value="settings.controls.restart"
                        />
                    </Setting>
                    <Setting name="Exit song">
                        <KeyBind
                            class="stretch"
                            name="s-c-quit"
                            v-model:value="settings.controls.exit"
                        />
                    </Setting>
                    <Setting name="Sensitivity">
                        <Range
                            class="stretch"
                            name="s-c-sens"
                            v-model:value="settings.controls.sensitivity"
                            unit="x"
                            :min="0.1"
                            :max="2"
                            :step="0.01"
                        />
                    </Setting>
                </SettingsSection>

                <SettingsSection name="Volume">
                    <Setting name="Master">
                        <Range
                            class="stretch"
                            name="s-v-master"
                            v-model:value="settings.volume.master"
                            unit="%"
                        />
                    </Setting>
                    <Setting name="Music">
                        <Range
                            class="stretch"
                            name="s-v-music"
                            v-model:value="settings.volume.music"
                            unit="%"
                        />
                    </Setting>
                    <Setting name="SFX">
                        <Range
                            class="stretch"
                            name="s-v-sfx"
                            v-model:value="settings.volume.sfx"
                            unit="%"
                        />
                    </Setting>
                </SettingsSection>

                <SettingsSection name="Development">
                    <Setting name="Video backgrounds">
                        <Toggle
                            class="stretch"
                            name="s-d-hitbox"
                            v-model:value="settings.developer.debugHitbox"
                        />
                    </Setting>
                    <p style="text-align: left">
                        <a href="" @click="clear">Clear localStorage </a> - You
                        broke it, didn't you? <br />
                        <!-- <a href="">Load dummy scores </a> - Too lazy to play video games? <br> -->
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            >God mode
                        </a>
                    </p>
                </SettingsSection>
            </div>
        </div>
    </main>
</template>

<style lang="less">
.settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .main-grid {
        display: grid;

        grid-template-columns: 1fr auto;
        grid-template-rows: auto 1fr;

        grid-template-areas: "title back" "settings settings";

        width: 800px;
        height: 650px;
        max-height: 650px;
    }

    #settings {
        grid-area: settings;
        overflow-y: scroll;
    }

    #back {
        grid-area: back;
    }

    #title {
        grid-area: title;
    }
}
</style>
