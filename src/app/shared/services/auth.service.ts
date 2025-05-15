import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, User as FirebaseUser, UserCredential, signOut, reauthenticateWithCredential, deleteUser } from '@angular/fire/auth';
import { Firestore, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, EmailAuthProvider } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../model/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<FirebaseUser | null>
  constructor(private auth: Auth, private router: Router, private firestore: Firestore) { 
    this.currentUser=authState(this.auth)
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email,password);
  }

  signOut(): Promise<void> {
    localStorage.setItem("isLoggedIn","false");
    localStorage.setItem("isAdmin", "false");
    return signOut(this.auth).then(()=>{
      this.router.navigateByUrl('/fooldal');
    });
  }

  async getCurrentUser(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = authState(this.auth).subscribe(user => {
        unsubscribe.unsubscribe();
        resolve(user);
      });
    });
  }

  async signUp(email : string, password : string, userData: Partial<User>): Promise<UserCredential> {
    try {
      const UserCredential=await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      await this.createUserData(UserCredential.user.uid, {
        ...userData,
        id: UserCredential.user.uid,
        email: email,
        role: "user",
      });
      return UserCredential;
    }  catch (error) {
      console.log("Hiba a regisztráció során:", error);
      throw error;
    }
  }

  private async createUserData(userId: string, userData: Partial<User>): Promise<void> {
    const userRef=doc(collection(this.firestore, "Users"),userId);
    return setDoc(userRef,userData);
  }

  async getRole(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const userRef = doc(this.firestore, 'Users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as User;
      return data.role || null;
    }

    return null;
  }


  isLoggedIn(): Observable<FirebaseUser | null> {
    return this.currentUser;
  }

  updateLoginStatus(isLoggedIn:boolean):void {
    localStorage.setItem("isLoggedIn", isLoggedIn? 'true': 'false');
  }

  async reauthenticate(currentPassword: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user || !user.email) return false;

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch {
      return false;
    }
  }

  async deleteCurrentUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await deleteUser(user);
    }
  }
}
