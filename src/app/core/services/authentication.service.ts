import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, UserCredential, User } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';

export interface IUser {
  fullName: string,
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth = getAuth();
  private authStateSubject = new BehaviorSubject<User | null>(null);
  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    // Monitor auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.authStateSubject.next(user);
    });
  }

  public signUpWithEmailAndPassword(user: IUser): Promise<boolean | unknown> {
    const database = getDatabase();

    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, user.email, user.password)
        .then((userCreated: UserCredential) => {
          set(ref(database, 'users/' + userCreated.user.uid), {
            email: user.email,
            fullName: user.fullName,
          }).then(() => resolve(true))
            .catch((error) => reject(false));
        }).catch((error) => reject(error));
    });
  }

  public signInWithEmailAndPassword(email: string, password: string): Promise<boolean | unknown> {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential: UserCredential) => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public checkAuthState(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        resolve(user !== null);
      });
    });
  }
  public isLoggedIn(): boolean {
    const auth = getAuth();
    return !!auth.currentUser; // Ensures this returns a boolean
  }


  public logout(): Promise<void> {
    return signOut(this.auth);
  }
}
