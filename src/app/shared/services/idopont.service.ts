import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  CollectionReference,
  getDoc
} from '@angular/fire/firestore';
import { catchError, from, Observable, of } from 'rxjs';
import { Idopont } from '../model/idopontok';
import { writeBatch } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class IdopontService {
  private idopontCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.idopontCollection = collection(this.firestore, 'Idopontok');
  }


  getAllIdopontok(): Observable<Idopont[]> {
    return collectionData(this.idopontCollection, { idField: 'id' }) as Observable<Idopont[]>;
  }

  getIdopontokByTeremId(teremid: string): Observable<Idopont[]> {
    const q = query(this.idopontCollection, where('teremid', '==', teremid));
    return collectionData(q, { idField: 'id' }) as Observable<Idopont[]>;
  }

  getIdopontokByTeremIdAndDate(teremid: string, date: string): Observable<Idopont[]> {
    const q = query(
      this.idopontCollection,
      where('teremid', '==', teremid),
      where('date', '==', date)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Idopont[]>;
  }

  bulkCreateIdopontokBatch(idopontok: Omit<Idopont, 'id'>[]) {
  const batch = writeBatch(this.firestore);

  idopontok.forEach(idopont => {
    const idopontRef = doc(collection(this.firestore, 'Idopontok'));
    batch.set(idopontRef, idopont);
  });

  return batch.commit();
}



  getIdopontById(id: string): Observable<Idopont | null> {
    const idopontDocRef = doc(this.firestore, 'Idopontok', id);
    return from(getDoc(idopontDocRef).then(docSnap => {
      if (docSnap.exists()) {
        return { ...(docSnap.data() as Idopont), id: docSnap.id };
      } else {
        return null;
      }
    })).pipe(
      catchError(() => of(null))
    );
  }
  updateIdopontAvailability(idopontId: string, available: boolean): Promise<void> {
    const idopontRef = doc(this.firestore, 'Idopontok', idopontId);
    return updateDoc(idopontRef, { available });
  }

  createIdopont(idopont: Omit<Idopont, 'id'>): Promise<any> {
    return addDoc(this.idopontCollection, idopont);
  }

  updateIdopont(id: string, updated: Partial<Idopont>): Promise<void> {
    return updateDoc(doc(this.firestore, 'Idopontok', id), updated);
  }

  deleteIdopont(id: string): Promise<void> {
  const foglalasRef = collection(this.firestore, 'Foglalasok');
  const q = query(foglalasRef, where('idopontid', '==', id));
  return getDocs(q)
    .then((querySnapshot) => {
      const deletePromises: Promise<void>[] = [];
      querySnapshot.forEach((docSnap) => {
        const foglalasDocRef = doc(this.firestore, 'Foglalasok', docSnap.id);
        deletePromises.push(deleteDoc(foglalasDocRef));
      });
      return Promise.all(deletePromises);
    })
    .then(() => {
      const idopontRef = doc(this.firestore, 'Idopontok', id);
      return deleteDoc(idopontRef);
    });
}
}
