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
import { Observable } from 'rxjs';
import { Terem } from '../model/termek';


@Injectable({
  providedIn: 'root'
})
export class TeremService {
  private teremCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.teremCollection = collection(this.firestore, 'Termek');
  }

  
  getAllTermek(): Observable<Terem[]> {
    return collectionData(this.teremCollection, { idField: 'id' }) as Observable<Terem[]>;
  }

  
  getTeremById(id: string): Promise<Terem | null> {
    const docRef = doc(this.firestore, 'Termek', id);
    return getDoc(docRef).then(snapshot => {
      if (snapshot.exists()) {
        return { ...(snapshot.data() as Terem), id: snapshot.id as unknown as string };
      }
      return null;
    });
  }

  
  getTermekByIds(ids: string[]): Promise<Terem[]> {
    if (!ids || ids.length === 0) return Promise.resolve([]);
    const q = query(this.teremCollection, where('__name__', 'in', ids));
    return getDocs(q).then(snapshot =>
      snapshot.docs.map(doc => ({ ...(doc.data() as Terem), id: doc.id as unknown as string }))
    );
  }

  
  createTerem(terem: Omit<Terem, 'id'>): Promise<DocumentReference> {
    return addDoc(this.teremCollection, terem);
  }

  
  updateTerem(id: string, updatedData: Partial<Terem>): Promise<void> {
    const docRef = doc(this.firestore, 'Termek', id);
    return updateDoc(docRef, updatedData);
  }

  
  deleteTerem(id: string): Promise<void> {
  const idopontRef = collection(this.firestore, 'Idopontok');
  const idopontQuery = query(idopontRef, where('teremid', '==', id));

  return getDocs(idopontQuery).then((idopontSnapshot) => {
    const allDeletes: Promise<void>[] = [];

    idopontSnapshot.forEach((idopontDoc) => {
      const idopontId = idopontDoc.id;
      const foglalasRef = collection(this.firestore, 'Foglalasok');
      const foglalasQuery = query(foglalasRef, where('idopontid', '==', idopontId));

      const foglalasPromise = getDocs(foglalasQuery).then((foglalasSnapshot) => {
        const foglalasDeletes: Promise<void>[] = [];
        foglalasSnapshot.forEach((foglalasDoc) => {
          foglalasDeletes.push(deleteDoc(doc(this.firestore, 'Foglalasok', foglalasDoc.id)));
        });
        return Promise.all(foglalasDeletes);
      });
      const idopontDeletePromise = foglalasPromise.then(() =>
        deleteDoc(doc(this.firestore, 'Idopontok', idopontId))
      );

      allDeletes.push(idopontDeletePromise);
    });

    return Promise.all(allDeletes);
  }).then(() => {
    return deleteDoc(doc(this.firestore, 'Termek', id));
  });
}
}
