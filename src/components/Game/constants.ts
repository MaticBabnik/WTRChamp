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
     * Song progressbar height
     */
    export const PROGRESSBAR_HEIGHT = 10;

    /**
     * How long do hit indicators show for
     */
    export const HIT_INDICATOR_LIFE = 600;

    /**
     * How long are they fully opaque for
     */
    export const HIT_INDICATOR_MAXVIS = 100;

    export const HIT_PERFECT = 33;
    export const HIT_GOOD = 66;
    export const HIT_OK = 100;

    export const HIT_MAX_DIST = 18;
}