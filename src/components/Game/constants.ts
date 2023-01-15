export namespace Constants {
    /**
     * Height (in pixels) of the playfield
     */
    export const PLAYFIELD_H = 600;

    /**
     * Size (in pixels) of the margin between the left screen border and the playfield 
     */
    export const MARGIN = 200;

    /**
     * Size (in pixels) of the player circle
     */
    export const PLAYER_SIZE = 10;

    // Minimum and maximum pitches for trombone champ
    export const PITCH_MIN = -178.75;
    export const PITCH_MAX = 178.75;
    export const PITCH_RANGE = PITCH_MAX - PITCH_MIN;

    /**
     * How many points of a bezier curve will be calculated for hitboxes
     * (doesn't affect rendering, since those curves are calculated by the browser)
     */
    export const HITBOX_RESOLUTION = 4;

    /**
     * Song progressbar height (px)
     */
    export const PROGRESSBAR_HEIGHT = 10;

    /**
     * How long do hit indicators show for (ms)
     */
    export const HIT_INDICATOR_LIFE = 600;

    /**
     * How long are they fully opaque for (ms)
     */
    export const HIT_INDICATOR_MAXVIS = 100;

    /**
     * Max absolute offset for perfect hit (ms)
     */
    export const HIT_PERFECT = 33;
    export const HIT_GOOD = 66;
    export const HIT_OK = 100;

    /**
     * The pitch distance at which hitboxes still register
     */
    export const HIT_MAX_DIST = 18;

    /**
     * Minimum ammount between notes to show countdown (ms)
     */
    export const COUNTDOWN_MIN_PAUSE = 5_000;
    /**
    * How much time before the note should the countdown hide (ms)
    */
    export const COUNTDOWN_HIDE_TIME = 1_000;
    /**
    * How long to fade in/out (ms)
    */
    export const COUNTDOWN_ANIM_TIME = 200;
}