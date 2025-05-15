import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  CollectionReference,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Terem } from '../model/termek';


@Injectable({
  providedIn: 'root'
})
export class TeremService {
  private teremCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.teremCollection = collection(this.firestore, 'Termek');
  }

  /** Összes terem lekérése */
  getAllTermek(): Observable<Terem[]> {
    return collectionData(this.teremCollection, { idField: 'id' }) as Observable<Terem[]>;
  }

  /** Egy terem lekérése ID alapján */
  getTeremById(id: string): Promise<Terem | null> {
    const docRef = doc(this.firestore, 'Termek', id);
    return getDoc(docRef).then(snapshot => {
      if (snapshot.exists()) {
        return { ...(snapshot.data() as Terem), id: snapshot.id as unknown as number };
      }
      return null;
    });
  }

  /** Több terem lekérése ID tömb alapján */
  getTermekByIds(ids: string[]): Promise<Terem[]> {
    if (!ids || ids.length === 0) return Promise.resolve([]);
    const q = query(this.teremCollection, where('__name__', 'in', ids));
    return getDocs(q).then(snapshot =>
      snapshot.docs.map(doc => ({ ...(doc.data() as Terem), id: doc.id as unknown as number }))
    );
  }

  /** Új terem hozzáadása */
  createTerem(terem: Omit<Terem, 'id'>): Promise<DocumentReference> {
    return addDoc(this.teremCollection, terem);
  }

  /** Terem frissítése */
  updateTerem(id: string, updatedData: Partial<Terem>): Promise<void> {
    const docRef = doc(this.firestore, 'Termek', id);
    return updateDoc(docRef, updatedData);
  }

  /** Terem törlése */
  deleteTerem(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'Termek', id);
    return deleteDoc(docRef);
  }
}
