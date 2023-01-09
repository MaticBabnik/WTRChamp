export enum ScreenName {
    MainMenu = 'MainMenu',

    SongSelect = 'SongSelect',
    Credits = 'Credits',
    Settings = 'Settings',

    Game = 'Game',
}


export type GrrSwitch = { (e: 'switch', c: ScreenName, props: Record<string, any>): void };

export interface GrrState {
    c: ScreenName;
    props: Record<string, any>;
}

export interface GrrComponent {
    tearDown?: () => void
}