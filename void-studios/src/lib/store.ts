import "server-only";
import fs from "fs";
import path from "path";
import { getAdminFirestore } from "@/lib/firebase/admin";

/**
 * Collection names — mirror the Firestore collections and the local fallback.
 */
export type CollectionName =
  | "users"
  | "projects"
  | "websites"
  | "ads"
  | "brands"
  | "subscriptions"
  | "payments"
  | "invoices"
  | "activity_logs";

type WithId = { id: string };

function fieldValue(doc: WithId, field: string): unknown {
  return (doc as Record<string, unknown>)[field];
}

export interface WhereFilter {
  field: string;
  value: unknown;
}

interface Datastore {
  create<T extends WithId>(collection: CollectionName, doc: T): Promise<T>;
  get<T extends WithId>(collection: CollectionName, id: string): Promise<T | null>;
  update<T extends WithId>(
    collection: CollectionName,
    id: string,
    patch: Partial<T>
  ): Promise<T | null>;
  remove(collection: CollectionName, id: string): Promise<boolean>;
  query<T extends WithId>(
    collection: CollectionName,
    filters?: WhereFilter[]
  ): Promise<T[]>;
}

/* -------------------------------------------------------------------------- */
/*                            Firestore datastore                             */
/* -------------------------------------------------------------------------- */

class FirestoreDatastore implements Datastore {
  async create<T extends WithId>(collection: CollectionName, doc: T): Promise<T> {
    const db = getAdminFirestore()!;
    await db.collection(collection).doc(doc.id).set(doc);
    return doc;
  }

  async get<T extends WithId>(collection: CollectionName, id: string): Promise<T | null> {
    const db = getAdminFirestore()!;
    const snap = await db.collection(collection).doc(id).get();
    return snap.exists ? (snap.data() as T) : null;
  }

  async update<T extends WithId>(
    collection: CollectionName,
    id: string,
    patch: Partial<T>
  ): Promise<T | null> {
    const db = getAdminFirestore()!;
    const ref = db.collection(collection).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;
    await ref.set(patch, { merge: true });
    const updated = await ref.get();
    return updated.data() as T;
  }

  async remove(collection: CollectionName, id: string): Promise<boolean> {
    const db = getAdminFirestore()!;
    const ref = db.collection(collection).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;
    await ref.delete();
    return true;
  }

  async query<T extends WithId>(
    collection: CollectionName,
    filters: WhereFilter[] = []
  ): Promise<T[]> {
    const db = getAdminFirestore()!;
    let q: FirebaseFirestore.Query = db.collection(collection);
    for (const f of filters) {
      q = q.where(f.field, "==", f.value);
    }
    const snap = await q.get();
    return snap.docs.map((d) => d.data() as T);
  }
}

/* -------------------------------------------------------------------------- */
/*                       Local JSON fallback datastore                        */
/* -------------------------------------------------------------------------- */

type LocalDB = Record<CollectionName, WithId[]>;

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

function emptyDB(): LocalDB {
  return {
    users: [],
    projects: [],
    websites: [],
    ads: [],
    brands: [],
    subscriptions: [],
    payments: [],
    invoices: [],
    activity_logs: [],
  };
}

class LocalDatastore implements Datastore {
  private read(): LocalDB {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(emptyDB(), null, 2));
        return emptyDB();
      }
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return { ...emptyDB(), ...parsed };
    } catch (e) {
      console.error("[store] local read error", e);
      return emptyDB();
    }
  }

  private write(db: LocalDB) {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    } catch (e) {
      console.error("[store] local write error", e);
    }
  }

  async create<T extends WithId>(collection: CollectionName, doc: T): Promise<T> {
    const db = this.read();
    db[collection].push(doc);
    this.write(db);
    return doc;
  }

  async get<T extends WithId>(collection: CollectionName, id: string): Promise<T | null> {
    const db = this.read();
    return (db[collection].find((d) => d.id === id) as T) || null;
  }

  async update<T extends WithId>(
    collection: CollectionName,
    id: string,
    patch: Partial<T>
  ): Promise<T | null> {
    const db = this.read();
    const idx = db[collection].findIndex((d) => d.id === id);
    if (idx === -1) return null;
    db[collection][idx] = { ...db[collection][idx], ...patch } as WithId;
    this.write(db);
    return db[collection][idx] as T;
  }

  async remove(collection: CollectionName, id: string): Promise<boolean> {
    const db = this.read();
    const before = db[collection].length;
    db[collection] = db[collection].filter((d) => d.id !== id);
    const changed = db[collection].length < before;
    if (changed) this.write(db);
    return changed;
  }

  async query<T extends WithId>(
    collection: CollectionName,
    filters: WhereFilter[] = []
  ): Promise<T[]> {
    const db = this.read();
    return db[collection].filter((d) =>
      filters.every((f) => fieldValue(d, f.field) === f.value)
    ) as T[];
  }
}

/* -------------------------------------------------------------------------- */

let cached: Datastore | null = null;

export function getStore(): Datastore {
  if (cached) return cached;
  cached = getAdminFirestore() ? new FirestoreDatastore() : new LocalDatastore();
  return cached;
}

export const usingFirestore = Boolean(getAdminFirestore());
