import { Song } from "./util/parser";

async function pickFile(paths: string[]): Promise<string | null> {
    try {
        return (await Promise.any(paths.map(path => (async () => {
            const st = (await fetch(path, { method: 'HEAD' })).status;
            if (st != 200) throw `Status: ${st}`;
            return path;
        })())));
    } catch {
        return null;
    }
}

export enum BGType {
    Video = 'video',
    Image = 'image',
    Other = 'other'
}

export interface IGameStartInfo {
    audio: string;
    bg: string;
    bgType: BGType;
    song: Song;
}


export async function init(key: string): Promise<IGameStartInfo> {
    const songRoot = `/beatmaps/${key}`;

    console.log('Looking for .tmb');

    const songJson = await (await fetch(`${songRoot}/song.tmb`)).text();
    const song = new Song(songJson);

    console.log('Found and parsed');

    //try the audio&bg
    console.log('Looking for sound+bg');
    const audio = await pickFile([`${songRoot}/song.ogg`]);
    const bg = await pickFile([`${songRoot}/bg.mp4`, `${songRoot}/bg.png`])
    console.log(`Found ${audio} and ${bg}`)
    if (audio == null) throw "No audio";

    if (bg == null) {
        return { audio, bg: '', bgType: BGType.Other, song };
    }

    return { audio, bg, bgType: bg.endsWith('.png') ? BGType.Image : BGType.Video, song };
}