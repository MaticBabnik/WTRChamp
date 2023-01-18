import { Constants } from "./constants";

import type { Song } from "./util/parser";
import { ScopedGameEvents, GameEvent } from "./util/event";

import type { AudioStore } from "@/stores/audio";
import type { ISettings } from "@/stores/settings";
import { ScoreKeeper } from "./score";

import { Grid } from "./entities/Grid";
import { Player } from "./entities/Player";
import { HoldAction } from "./entities/HoldAction";
import { HitObjects } from "./entities/HitObjects";
import { ScoreOverlay } from "./entities/ScoreOverlay";
import { NoteCountdown } from "./entities/NoteCountdown";
import { HitIndicators } from "./entities/HitIndicators";
import { SongProgressbar } from "./entities/SongProgressbar";

export interface IEntity {
    render(ctx: CanvasRenderingContext2D): void;
}

export interface IKeyState {
    state: boolean,
    since: number
}

export type Kkey = 'exit' | 'play' | 'restart';

interface IGameEvents {
    addEventListener(type: GameEvent | string, callback: (e: GameEvent) => any, options?: AddEventListenerOptions | boolean): void;
    removeEventListener(type: GameEvent | string, callback: (e: GameEvent) => any, options?: AddEventListenerOptions | boolean): void;
}

export class Game extends ScopedGameEvents implements IGameEvents {
    protected ctx: CanvasRenderingContext2D;

    // entities
    protected grid: Grid;
    protected player: Player;
    protected hitObjects: HitObjects
    protected holdActions: HoldAction[];
    protected progressbar: SongProgressbar;
    protected hitIndicators: HitIndicators;
    protected scoreOverlay: ScoreOverlay;
    protected noteCountdown: NoteCountdown;
    public scoreKeeper = new ScoreKeeper();

    constructor(public canvas: HTMLCanvasElement, public settings: ISettings, public song: Song, protected audioStore: AudioStore) {
        super();
        canvas.requestPointerLock();
        this.w = canvas.width = canvas.offsetWidth;
        this.h = canvas.height = canvas.offsetHeight;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) throw "Couldn't get context";
        this.ctx = ctx;

        //handle keyboard inputs
        this.registerEventHandler(document, 'keyup', e => this.keyEvent(false, e))
        this.registerEventHandler(document, 'keydown', e => this.keyEvent(true, e))

        //handle pointer lock
        this.registerEventHandler(document, 'click', () => this.pointerLockEvent());

        this.grid = new Grid(this);
        this.player = new Player(this);
        this.progressbar = new SongProgressbar(this, song.endTime);
        this.hitIndicators = new HitIndicators(this);
        this.hitObjects = new HitObjects(this, this.hitIndicators);
        this.scoreOverlay = new ScoreOverlay(this);
        this.noteCountdown = new NoteCountdown(this, this.hitObjects);
        this.holdActions = [
            new HoldAction(this, 'exit', 500, "Hold to exit", () => {
                this.dispatchEvent(new GameEvent('exit'));
            }),
            new HoldAction(this, 'restart', 500, "Hold to restart", () => {
                this.dispatchEvent(new GameEvent('restart'));
            })
        ];
    }

    //#region Time

    protected start = Date.now();

    public get time() {
        return Date.now() - this.start;
    }

    //#endregion Time

    //#region input
    public keyboard: Record<Kkey, IKeyState> = {
        exit: { state: false, since: 0 },
        play: { state: false, since: 0 },
        restart: { state: false, since: 0 }
    }

    keyEvent(v: boolean, e: KeyboardEvent) {
        switch (e.code) {
            case this.settings.controls.play:
                if (this.keyboard.play.state == v) break; // prevent key repeating from fucking with us
                this.keyboard.play.state = v; //update state
                if (v) this.keyboard.play.since = this.time; //update press start time
                break;
            case this.settings.controls.restart:
                if (this.keyboard.restart.state == v) break;
                this.keyboard.restart.state = v;
                if (v) this.keyboard.restart.since = this.time;
                break;
            case this.settings.controls.exit:
                if (this.keyboard.exit.state == v) break;
                this.keyboard.exit.state = v;
                if (v) this.keyboard.exit.since = this.time;
                break;
        }
    }

    pointerLockEvent() {
        if (document.pointerLockElement == null) {
            this.canvas.requestPointerLock();
        }
    }
    //#endregion input

    //#region Layout
    public w: number;
    public h: number;

    public get gameRect() {
        const x = Constants.MARGIN;
        const w = this.w - Constants.MARGIN;
        const y = (this.h - Constants.PLAYFIELD_H) / 2;
        const h = Constants.PLAYFIELD_H;

        return { x, y, w, h };
    }
    //#endregion Layout

    //#region Lifetime stuff
    protected run = true;

    public async startGame() {
        // await this.music.play();
        this.start = Date.now();
        this.mainLoop();
    }

    public destroy() {
        // destory all events
        this.removeGameEventHandlers();
        this.player.trombone.stop();
        this.run = false;
    }
    //#endregion Lifetime stuff

    public get playerPitch() {
        return this.player.playerPitch;
    }

    public mainLoop() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        // Dim the background
        const alpha = this.settings.gameplay.backgroundDim / 100;
        this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        this.ctx.fillRect(0, 0, this.w, this.h);
        // Render the playfield grid
        this.grid.render(this.ctx);
        // Render the notes
        this.hitObjects.render(this.ctx);
        // Render the player circle thing-y
        this.player.render(this.ctx);
        //TODO: Render Trombone

        // Render Hit indicators (Miss,OK,Good,Perfect)
        this.hitIndicators.render(this.ctx);
        // Render the song progress bar
        this.progressbar.render(this.ctx);
        // Render score and combo text
        this.scoreOverlay.render(this.ctx);
        // Render note countdown
        this.noteCountdown.render(this.ctx);
        // Render exit/restart overlays
        this.holdActions.forEach(ha => ha.render(this.ctx));

        if (this.time > this.song.endTime) {
            this.dispatchEvent(new GameEvent('done'));
        }

        if (this.run) requestAnimationFrame(this.mainLoop.bind(this));
    }
}