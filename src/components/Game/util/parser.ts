

type SongNote = [
    start: number,
    length: number,
    startPitch: number,
    pitchDiff: number, // not quite sure why this is needed
    endPitch: number
];

enum NoteField {
    startTime = 0,
    length,
    startPitch,
    pitchDiff,
    endPitch
}

interface ILyric {
    bar: number,
    text: string,
}

interface SongTMB {
    //header? format?
    UNK1: 0,
    //metadata
    name: string,
    shortName: string,
    author: string,
    description: string,
    genre: string,
    year: number,

    // metadata?
    difficulty: number,
    endpoint: number,
    lyrics: ILyric[],
    savednotespacing: number,
    trackRef: string,


    // the main thing
    notes: SongNote[],

    // probably needed to decode notes
    tempo: number,
    timesig: number,
}

/**
 * TIMES ARE IN MS
 */
export interface SongHitObject {
    start: number,
    end: number,
    segments: HitObjectSegment[]
}

export interface HitObjectSegment {
    pitchStart: number,
    pitchEnd: number,
    timeStart: number,
    timeEnd: number
}

export class Song {

    protected rawObject: SongTMB;
    protected hitObjects: SongHitObject[];
    public endTime: number;

    private toHitObject(notes: SongNote[]): SongHitObject {
        const beat = 60_000 / this.rawObject.tempo; //ms per beat

        const ho: SongHitObject = { start: notes[0][NoteField.startTime] * beat, end: 0, segments: [] };

        notes.forEach(x => {
            ho.segments.push({
                pitchStart: x[NoteField.startPitch],
                pitchEnd: x[NoteField.endPitch],
                timeStart: x[NoteField.startTime] * beat,
                timeEnd: (x[NoteField.startTime] + x[NoteField.length]) * beat
            });
        })

        ho.end = ho.segments.at(-1)?.timeEnd ?? 0;
        if (ho.end == 0) throw "WTF???";

        return ho;
    }

    private static noteOverlap(n1: SongNote, n2: SongNote): number {
        const t1 = n1[NoteField.startTime] + n1[NoteField.length],
            t2 = n2[NoteField.startTime];

        const overlap = t1 - t2;

        return overlap;
    }

    private toHitObjects(song: SongTMB): SongHitObject[] {
        const ho: SongHitObject[] = [];
        let noteGroup: SongNote[] = [];

        for (const note of song.notes) {
            const previousNote = noteGroup.at(-1);

            if (previousNote &&
                Song.noteOverlap(previousNote, note) < 0) {
                // notes don't overlap; end current group
                ho.push(this.toHitObject(noteGroup));
                noteGroup = [];
            }
            noteGroup.push(note);
        }

        if (noteGroup.length > 0) ho.push(this.toHitObject(noteGroup));

        return ho;
    }

    public get HitObjects() {
        return this.hitObjects;
    }

    public constructor(content: string) {
        this.rawObject = JSON.parse(content);
        this.hitObjects = this.toHitObjects(this.rawObject);

        const lastHitobject = this.hitObjects.at(-1);
        if (!lastHitobject) throw new Error("Empty track");

        this.endTime = this.rawObject.endpoint * (60_000 / this.rawObject.tempo);
        
        if (lastHitobject.end > this.endTime) {
            console.warn(`Song "${this.rawObject.name}" has invalid endTime, fixing`);
            this.endTime = lastHitobject.end + 300;
        }
    }
}