import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Idopont } from '../model/idopontok';

@Injectable({
  providedIn: 'root'
})
export class IdopontService {
  private idopontCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.idopontCollection=collection(this.firestore, 'Idopontok');
  }

  
  getAllIdopontok(): Observable<Idopont[]> {
    return collectionData(this.idopontCollection, { idField: 'id' }) as Observable<Idopont[]>;
  }

  
  getIdopontokByTeremId(teremid: string): Observable<Idopont[]> {
    const q = query(this.idopontCollection, where('teremid', '==', teremid));
    return collectionData(q, { idField: 'id' }) as Observable<Idopont[]>;
  }

  
  createIdopont(idopont: Omit<Idopont, 'id'>): Promise<any> {
    return addDoc(this.idopontCollection, idopont);
  }

  
  updateIdopont(id: string, updated: Partial<Idopont>): Promise<void> {
    return updateDoc(doc(this.firestore, 'Idopontok', id), updated);
  }

  
  deleteIdopont(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'Idopontok', id));
  }
}
