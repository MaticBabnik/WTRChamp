export type GEventType = 'exit' | 'restart' | 'done';

export class GameEvent extends Event {
    public constructor(type: GEventType) {
        super(type);
    }
}

interface IEventHandler<
    ETarget extends EventTarget = EventTarget,
    EType extends string = string,
    EHandler extends EventListenerOrEventListenerObject = EventListenerOrEventListenerObject
> {
    target: ETarget;
    type: EType;
    handler: EHandler
}


type DOMEventMapDefinitions = [
    [Document, DocumentEventMap],
    [Window, WindowEventMap],
    [Element, ElementEventMap],
    [EventSource, EventSourceEventMap],
    [HTMLElement, HTMLElementEventMap],
];

type DOMEventSubscriber = DOMEventMapDefinitions[number][0];

type MapDefinitionToEventMap<D extends { [K: number]: any[] }, T> = { [K in keyof D]: D[K] extends any[] ? (T extends D[K][0] ? D[K][1] : never) : never };
type GetDOMEventMaps<T extends DOMEventSubscriber> = MapDefinitionToEventMap<DOMEventMapDefinitions, T>;

type MapEventMapsToKeys<D extends { [K: number]: any }> = { [K in keyof D]: D[K] extends never ? never : keyof D[K] };
type MapEventMapsToEvent<D extends { [K: number]: any }, T extends PropertyKey> = { [K in keyof D]: D[K] extends never ? never : (T extends keyof D[K] ? D[K][T] : never) };


/**
 * Class that can emit it's own events and keep track of the listeners its child classes register
 */
export class ScopedGameEvents extends EventTarget {

    private activeHandlers: IEventHandler[] = [];

    /** 
     * Wrapper around `addEventListener`
    */
    public registerEventHandler<T extends DOMEventSubscriber, K extends MapEventMapsToKeys<GetDOMEventMaps<T>>[number] & string>(
        target: T,
        type: K,
        handler: (this: T, ev: (MapEventMapsToEvent<GetDOMEventMaps<T>, K>[number])) => any
    ) {
        if (handler == null) return;
        target.addEventListener(type, handler as any);
        this.activeHandlers.push({ target, type, handler: handler as any });
    }

    /**
     * Wrapper around `removeEventListener`
     */
    public removeEventHandler<T extends DOMEventSubscriber, K extends MapEventMapsToKeys<GetDOMEventMaps<T>>[number] & string>(
        target: T,
        type: K,
        handler: (this: T, ev: (MapEventMapsToEvent<GetDOMEventMaps<T>, K>[number])) => any
    ) {
        target.removeEventListener(type, handler as any);
        this.activeHandlers = this.activeHandlers.filter(r =>
            r.type != type || r.handler != handler as any || r.target != target
        )
    }

    /**
     * Removes all handlers that the game instance has registered
     */
    public removeGameEventHandlers() {
        this.activeHandlers.forEach(ah => {
            ah.target.removeEventListener(ah.type, ah.handler);
        })
    }
}