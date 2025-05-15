import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, doc, deleteDoc, getDocs, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Foglalas } from '../model/foglalasok';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FoglalasokService {

  private foglalasCollection: CollectionReference;

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.foglalasCollection=collection(this.firestore,"Foglalasok")
  }



  
  getFoglalasokByUserId(userId: string): Observable<Foglalas[]> {
    const q = query(this.foglalasCollection, where('userid', '==', userId));
    return collectionData(q, {idField: 'id'}) as Observable<Foglalas[]>;
  }

  
  addFoglalas(foglalas: Omit<Foglalas, 'id'>): Promise<void> {
    return addDoc(this.foglalasCollection, foglalas)
      .then(() => {})
      .catch(err => {
        console.error('Hiba foglalás hozzáadásánál:', err);
        throw err;
      });
  }

  
  async deleteFoglalas(foglalasId: string): Promise<void> {
    const docRef = doc(this.firestore, 'Foglalasok', foglalasId);
    await deleteDoc(docRef);
  }
}
