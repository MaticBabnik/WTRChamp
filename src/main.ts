import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/style.less';

import { ScreenName } from './grr'
import App from './App.vue';

import MainMenu from './components/MainMenu.vue';
import SongSelect from './components/SongSelect.vue';
import Settings from './components/Settings.vue';
import Game from './components/Game.vue';
import Credits from './components/Credits.vue';



const app = createApp(App)
app.component(ScreenName.Game, Game);
app.component(ScreenName.Credits, Credits);
app.component(ScreenName.Settings, Settings);
app.component(ScreenName.MainMenu, MainMenu);
app.component(ScreenName.SongSelect, SongSelect);
app.use(createPinia())

window.addEventListener('click', () => {
    app.mount('#app')
}, { once: true });

