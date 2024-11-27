import {child, DataSnapshot, push, ref} from "firebase/database";
import {auth, database} from "@/firebase/config";
import {updateProfile} from "firebase/auth";
import {errorMessage, successMessage} from "@/utils/functions";

export function GetDatabaseReference(databaseReference: string) : any {
  return child(ref(database), databaseReference);
}

export function GetTotalValue(data:DataSnapshot[] | undefined, dataName?:string) : number {
  if (!data) return 0;
  else if (dataName == "amount") return data.reduce((sum, snap) => {
      const data = snap.val();
      return sum + (data.amount || 0);
    }, 0);
  else return data.reduce((sum, snap) => {
      const data = snap.val();
      return sum + (data.value || 0);
    }, 0);
}

export function GenerateDatabaseKey(databaseReference: string) : string {
  return push(child(ref(database), databaseReference)).key!
}

export const UpdateUserDisplayName = (newDisplayName: string) => {
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: newDisplayName
      }).then(() => {
        successMessage("Display name updated")
      }).catch((error) => {
        errorMessage(error.code + ": " + error.message)
      })
    }
}