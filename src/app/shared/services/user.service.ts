import { Injectable } from '@angular/core';
import { collection, doc, getDoc, getDocs, where, query,deleteDoc, Firestore, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { from, Observable, switchMap, of } from 'rxjs';
import { User } from '../model/users';
import { Idopont } from '../model/idopontok';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private authService: AuthService) { }

  getUserProfil(): Observable<{
    user: User | null,
    idopontok: Idopont[]
  }> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        
        if (!authUser) {
          return of({
            user: null,
            idopontok: [],
          });
        } else {
          console.log("Bejelentkezett user ID:", authUser.uid);
        }
        console.log(authUser.uid);
        return from(this.fetchUserWithIdopontok(authUser.uid));
      })
    );
  }

  private async fetchUserWithIdopontok(userId: string): Promise <{
    user: User | null,
    idopontok: Idopont[],
  }> {
    try {
      const userDocRef= doc(this.firestore, 'Users', userId);
      const userSnapshot = await getDoc(userDocRef);
      console.log(userId);
      if (!userSnapshot.exists()) {
        console.log("belépett");
        return {
          user: null,
          idopontok: [],
        };
      }

      const userData= userSnapshot.data() as User;
      const user= {...userData, id: userId}

      if (!user.idopontok || user.idopontok.length === 0) {
        return {
          user,
          idopontok: [],
        };
      }

      const idopontCollection = collection(this.firestore,"Idopontok");
      const q = query(idopontCollection, where('id', 'in', user.idopontok));
      const idopontSnapshot=await getDocs(q);

      const idopontok: Idopont[] = [];
      idopontSnapshot.forEach(doc => {
        idopontok.push({...doc.data(), id:doc.id} as Idopont);
      });

      return {
        user,
        idopontok,
      };
    } catch(error) {
      console.log("Hiba a user lekérdezésnél:", error);
      return {
        user: null,
        idopontok: [],
      }
    }
  }

  
  async updateUserProfil(userId: string, data: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    await updateDoc(userDocRef, data);
  }

  
  async deleteUserProfil(userId: string): Promise<void> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    await deleteDoc(userDocRef);
    this.authService.signOut();
  }
}

