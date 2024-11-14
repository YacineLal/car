import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';

export interface IUser {
  fullName: string,
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {
  }

  public signUpWithEmailAndPassword(user: IUser): Promise<boolean | unknown> {
    const database = getDatabase();

    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(getAuth(), user.email, user.password)
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
      signInWithEmailAndPassword(getAuth(), email, password)
        .then((userCredential: UserCredential) => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public isLoggedIn(): boolean {
    const user = getAuth().currentUser;
    return user !== null;
  }
}
