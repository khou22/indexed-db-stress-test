import { deleteDB, IDBPDatabase, IDBPTransaction, openDB } from "idb";
import _ from "lodash";
import { RowData } from "../models";

const DB_NAME = "idb-stress-test";
const DB_STORE = "test-store";
const INDEX_KEY = "id";

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
          db.deleteObjectStore(DB_STORE);
          this.initializeLatestDB(db);
        }
      },
    });
  };

  initializeLatestDB = (db: IDBPDatabase) => {
    const store = db.createObjectStore(DB_STORE, { keyPath: INDEX_KEY });
    store.createIndex(INDEX_KEY, INDEX_KEY);
    return db;
  };

  connectToDB = () => openDB(DB_NAME, 1);

  wipeDB = (db: IDBPDatabase) => {
    db.clear(DB_NAME);
    return db;
  };

  writeRows = async (
    rows: RowData[],
    onComplete?: (totalRows: number) => void
  ) => {
    const db = await this.connectToDB();

    const chunks = _.chunk<RowData>(rows, 200);

    for (const chunk of chunks) {
      const tx = db.transaction(DB_STORE, "readwrite");
      const bulkPut = chunk.map((row) => tx.store.put(row));
      await Promise.all([...bulkPut, tx.done as any]);
    }

    if (onComplete) onComplete(rows.length);
  };
}
