import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/style.less';

import { ScreenName } from './grr'
import App from './App.vue';

import GameScreen from './components/GameScreen.vue';
import ScoreScreen from './components/ScoreScreen.vue';
import CreditsScreen from './components/CreditsScreen.vue';
import SettingsScreen from './components/SettingsScreen.vue';
import MainMenuScreen from './components/MainMenuScreen.vue';
import SongSelectScreen from './components/SongSelectScreen.vue';

const app = createApp(App)
app.component(ScreenName.Game, GameScreen);
app.component(ScreenName.Credits, CreditsScreen);
app.component(ScreenName.Settings, SettingsScreen);
app.component(ScreenName.MainMenu, MainMenuScreen);
app.component(ScreenName.SongSelect, SongSelectScreen);
app.component(ScreenName.Score, ScoreScreen);

app.use(createPinia())

console.log("%cWtrchamp", 'color:#f4f;font-size:2rem;');
console.log({ publicBaseUrl: import.meta.env.VITE_PUBLIC_BASE, mode: import.meta.env.MODE });

window.addEventListener('click', () => {
    app.mount('#app')
}, { once: true });

