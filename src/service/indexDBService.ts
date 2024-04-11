// indexedDB.ts

const DB_NAME = 'my_database';
const STORE_NAME = 'my_store';

class IndexedDBManager {
    private db: IDBDatabase | null = null;
    private indexedDB;
    private request;

    constructor() {
        console.log('constructor');        
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        
      }

    init() {
        // 1

        if (!this.indexedDB) {
            console.log('IndexedDB could not be found in this browser.');
            return false;
        } else {
            console.log('IndexedDB found.');
            // 2, 1 is the version of the database
            const request = this.indexedDB.open(DB_NAME, 1);
            return true;
        }
    }

    async openDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(DB_NAME, 1);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                if (!this.db.objectStoreNames.contains(STORE_NAME)) {
                    this.db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    }

    async addItem(item: any): Promise<void> {
        if (!this.db) await this.openDB();
        const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.add(item);
    }

    async getAllItems(): Promise<any[]> {
        if (!this.db) await this.openDB();
        const transaction = this.db!.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onerror = (event) => {
                console.error('Error getting items:', event.target.error);
                reject(event.target.error);
            };
        });
    }
}

const indexedDBManager = new IndexedDBManager();
export default indexedDBManager;
