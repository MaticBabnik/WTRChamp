import { defineStore } from 'pinia'

interface IMapMeta {
  name: string,
  shortName: string,
  author: string,
  description: string,
  genre: string,
  year: number,
}

type MapCache = Record<string, IMapMeta>;

export const useMapStore = defineStore('maps', {
  state() {
    let cached: MapCache | null = null;

    try {
      const d = localStorage.getItem('maps');
      cached = JSON.parse(d ?? '');
      console.log(`Read ${Object.keys(cached ?? {}).length} maps from localStorage`);
    } catch {
      // if loading fails we write the defaults
      console.warn('Map cache invalid')
      localStorage.setItem('maps', JSON.stringify(cached = {}));
    }
    return {
      maps: cached as MapCache
    };
  },
  actions: {
    async fetchMaps() {
      const f = await fetch('/beatmaps.json');
      const data = await f.json() as string[];

      const newCached: MapCache = {};
      const promises: Promise<any>[] = [];

      for (const key of data) {
        if (key in this.maps) {
          newCached[key] = this.maps[key];
        } else {
          promises.push((async () => {
            const mapReq = await fetch(`/beatmaps/${key}/song.tmb`);
            const mapData = await mapReq.json() as IMapMeta;

            newCached[key] = {
              name: mapData.name,
              shortName: mapData.shortName,
              author: mapData.author,
              description: mapData.description,
              genre: mapData.genre,
              year: mapData.year
            }
          })());
        }
      }

      await Promise.all(promises);
      console.log('Fetched map list')
      this.maps = newCached;
      localStorage.setItem('maps', JSON.stringify(newCached));
    }
  }
})
