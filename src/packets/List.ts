import { Container } from "./Container.js";
import { ListEntry } from "./ListEntry.js";

abstract class List<T extends ListEntry> extends Container {
    _items: T[];
    _index: number;
    constructor(id = 0, version = 0) {
        super(id, version);
        this._items = [];
        this._index = 0;
    }
    get items() {
        return this._items;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
    }
    get hasHeader() {
        return this._header !== undefined;
    }
    setHeader() {
        this._header = new ArrayBuffer(8);
        const view = new DataView(this._header);
        view.setInt16(0, this._id);
        view.setInt16(2, this._size);
        view.setInt16(4, this._version);
        view.setInt16(6, 0);
    }
    isHeaderValid() {
        if (this._header === undefined) {
            return false;
        }
        const view = new DataView(this._header);
        const id = view.getInt16(0);
        const size = view.getInt16(2);
        const version = view.getInt16(4);
        const reserved = view.getInt16(6);
        return id === this._id && size === this._size && version === this._version && reserved === 0;
    }
    push(item: T) {
        this._items = [item, ...this._items];
        this._size += item.size;
    }
    getItems() {
        return this._items;
    }
    pop() {
        const item = this._items[0];
        this._items.splice(0, 1);
        this._size -= item.size;
    }

    first(): T {
        return this._items[0];
    }

    next(): T {
        this._index++;
        return this._items[this._index];
    }

    serialize() {
        const buffer = new ArrayBuffer(this._size);
        const view = new DataView(buffer);
        let offset = 0;
        for (const item of this._items) {
            const itemBuffer = item.serialize();
            const itemView = new DataView(itemBuffer);
            for (let index = 0; index < itemBuffer.byteLength; index++) {
                view.setInt8(offset, itemView.getInt8(index));
                offset++;
            }
        }
        return buffer;
    }
}
