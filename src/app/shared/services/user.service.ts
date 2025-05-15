import { Injectable } from '@angular/core';
import { collection, doc, getDoc, deleteDoc, Firestore, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { from, Observable, switchMap, of } from 'rxjs';
import { User } from '../model/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private authService: AuthService) {}

  getUserProfil(): Observable<User | null> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of(null);
        }
        return from(this.fetchUser(authUser.uid));
      })
    );
  }

  private async fetchUser(userId: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.firestore, 'Users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        return null;
      }

      const userData = userSnapshot.data() as User;
      return { ...userData, id: userId };

    } catch (error) {
      console.error("Hiba a felhasználó lekérdezésénél:", error);
      return null;
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
