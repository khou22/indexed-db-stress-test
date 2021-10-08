import { deleteDB, IDBPDatabase, IDBPTransaction, openDB } from "idb";
import _ from "lodash";
import { RowData } from "../models";
import { POSSIBLE_NAMES } from "../utils/mock";

const DB_NAME = "idb-stress-test";
const DB_STORE = "test-store";
const INDEX_KEY = "id";

const SHARDING = false;
export class DatabaseOperator {
  initDB = async () => {
    await deleteDB(DB_NAME);
    openDB(DB_NAME, 1, {
      upgrade: (
        db: IDBPDatabase,
        oldVersion: number,
        newVersion: number | null,
        transaction: IDBPTransaction<unknown, string[], "versionchange">
      ) => {
        if (newVersion === null || oldVersion === 0) {
          this.initializeLatestDB(db);
        } else {
          POSSIBLE_NAMES.forEach((name) => {
            db.deleteObjectStore(this.getStoreForName(name));
          });
          db.deleteObjectStore(DB_STORE);
          this.initializeLatestDB(db);
        }
      },
    });
  };

  initializeLatestDB = async (db: IDBPDatabase) => {
    await Promise.all(
      POSSIBLE_NAMES.concat([DB_STORE]).map(async (name) => {
        const storeName = this.getStoreForName(name);
        const store = await db.createObjectStore(storeName, {
          keyPath: INDEX_KEY,
        });
        store.createIndex(INDEX_KEY, INDEX_KEY);
      })
    );
    return db;
  };

  connectToDB = () => openDB(DB_NAME, 1);

  wipeDB = (db: IDBPDatabase) => {
    db.clear(DB_NAME);
    return db;
  };

  getStoreForName = (name: string): string => {
    if (name === DB_STORE) return DB_STORE;
    return `${name}_store`;
  };

  processRow = (row: RowData): RowData => {
    return {
      ...row,
      payload: row.payload.slice(),
    };
  };

  writeRowsToStore = async (
    db: IDBPDatabase,
    storeName: string,
    rows: RowData[]
  ) => {
    console.log(`[${storeName}] Writing ${rows.length}`);
    const chunks = _.chunk<RowData>(rows, 200);

    const start = performance.now();
    for (const chunk of chunks) {
      const tx = db.transaction(storeName, "readwrite");
      const bulkPut = chunk.map((row) => tx.store.put(row));
      await Promise.all([...bulkPut, tx.done as any]);
    }
    const end = performance.now();

    console.log(
      `[${storeName}] Finished writing ${rows.length} in ${(
        end - start
      ).toFixed(0)}`
    );
  };

  writeRows = async (
    rows: RowData[],
    onComplete?: (totalRows: number) => void
  ) => {
    const db = await this.connectToDB();

    if (!SHARDING) {
      this.writeRowsToStore(db, DB_STORE, rows);
      if (onComplete) onComplete(rows.length);
      return;
    }

    const rowsByName = _.groupBy<RowData>(rows, "name");

    await Promise.all(
      Object.entries(rowsByName).map(([name, rows]) =>
        this.writeRowsToStore(db, this.getStoreForName(name), rows)
      )
    );

    if (onComplete) onComplete(rows.length);
  };
}
