

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
    lyrics: ILyric[], //FIXME: umm?
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
    pitches: PitchTime[]

}

export interface PitchTime {
    pitch: number,
    time: number
}

export class Song {

    protected rawObject: SongTMB;
    protected hitObjects: SongHitObject[];
    public endTime: number;

    private toHitObject(notes: SongNote[]): SongHitObject {
        const beat = 60_000 / this.rawObject.tempo; //ms per beat

        if (notes.length == 1) {
            const start = notes[0][NoteField.startTime],
                end = start + notes[0][NoteField.length],
                pitch1 = notes[0][NoteField.startPitch],
                pitch2 = notes[0][NoteField.endPitch];

            return {
                start: start * beat,
                end: end * beat,
                pitches: [
                    { time: start * beat, pitch: pitch1 },
                    { time: end * beat, pitch: pitch2 },
                ]
            };
        } else if (notes.length > 1) {
            const ho: SongHitObject = { start: notes[0][NoteField.startTime] * beat, end: 0, pitches: [] };

            notes.forEach(x => {
                ho.pitches.push({
                    pitch: x[NoteField.endPitch],
                    time: (x[NoteField.startTime] + x[NoteField.length]) * beat
                });
            })

            ho.end = ho.pitches.at(-1)?.time ?? 0;
            if (ho.end == 0) throw "WTF???";

            return ho;
        } else throw new Error("No notes passed");
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
        console.log(`Last hitobject ends @ ${lastHitobject?.end / 1_000} s`)
        console.log(this.hitObjects[0]);
    }
}