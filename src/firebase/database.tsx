import { ref, child, get } from "firebase/database";
import { database } from "@/firebase/config";
import { useEffect, useState } from "react";
import { auth } from '@/firebase/config'
import { updateProfile } from "firebase/auth";
import { errorMessage, successMessage } from "@/utils/functions";

export default function GetDataExist(databaseReference: string): any {
  const [dataExist, setDataExist] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      get(child(ref(database), databaseReference))
        .then((snapshot) => {
          setDataExist(snapshot.exists())
        }).catch((error) => {
          console.error(error.message);
          setError(error.message)
        }).finally(() => {
          setDataLoading(false);
        })
  }, [databaseReference]);

  return { dataExist, dataLoading, error };
}


export function GetDataCount(databaseReference: string): any {
  const [dataCount, setDataCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get(child(ref(database), databaseReference))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setDataCount(snapshot.size)
          } else setDataCount(0)
        }).catch((error) => {
          console.error(error.message);
          setError(error.message)
        }).finally(() => {
        setDataLoading(false);
        })
  }, [databaseReference]);

  return { dataCount, dataLoading, error };
}


export function GetDatabaseValue(databaseReference: string): any {
  const [dataExist, setDataExist] = useState(false);
  const [data, setData] = useState<any>();
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get(child(ref(database), databaseReference))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setDataExist(true);
            setData(snapshot.val());
          } else {
            setDataExist(false);
          }
        }).catch((error) => {
          console.error(error.message);
          setError(error.message)
        }).finally(() => {
          setDataLoading(false);
        })
  }, [databaseReference]);

  return { dataExist, data, dataLoading, error };
}


export const GetObjectData = (databaseReference: string) => {
  const [dataExist, setDataExist] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      get(child(ref(database), databaseReference)).then((snapshot) => {
        if (snapshot.exists()) {
          setDataExist(true);
          const snapshotValue = snapshot.val();
          const itemsWithKeys = Object.entries(snapshotValue).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return { key, ...value, childCount: Object.keys(value).length };
            } else {
              return null;
            }
          });
          setData(itemsWithKeys);
        } else {
          setDataExist(false)
        }
      }).catch((error) => {
        console.error(error.message);
        setError(error.message)
      }).finally(() => {
        setDataLoading(false);
      })
  }, [databaseReference]);

  return { dataExist, data, dataLoading, error };
};


export const GetObjectDataWithTotal = (databaseReference: string) => {
  const [dataExist, setDataExist] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get(child(ref(database), databaseReference)).then((snapshot) => {
      if (snapshot.exists()) {
        setDataExist(true);
        const snapshotValue = snapshot.val();
        const itemsWithKeys = Object.entries(snapshotValue).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return { key, ...value, childCount: Object.keys(value).length };
          } else {
            return null;
          }
        });
        setData(itemsWithKeys);
        const totalValues = Object.values(snapshotValue).reduce((sum, snapshotData) => {
          if (typeof snapshotData === 'object' && snapshotData != null && typeof sum === 'number') {
            if ('value' in snapshotData && typeof snapshotData.value === 'number') return sum + snapshotData.value;
            else if ('amount' in snapshotData && typeof snapshotData.amount === 'number') return sum + snapshotData.amount;
          }
          return sum;
        }, 0);
        setTotal(Number(totalValues));
      } else {
        setDataExist(false);
      }
    }).catch((error) => {
      setError(error.message);
    }).finally(() => {
      setDataLoading(false);
    })
  }, [databaseReference]);

  return { error, dataExist, data, total, dataLoading };
};


export const useGetObjectDataWithTotal = (databaseReference: string) => {
  const [dataExist, setDataExist] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get(child(ref(database), databaseReference)).then((snapshot) => {
      if (snapshot.exists()) {
        setDataExist(true);
        const snapshotValue = snapshot.val();
        const itemsWithKeys = Object.entries(snapshotValue).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return { key, ...value, childCount: Object.keys(value).length };
          } else {
            return null;
          }
        });
        setData(itemsWithKeys);
        const totalValues = Object.values(snapshotValue).reduce((sum, snapshotData) => {
          if (typeof snapshotData === 'object' && snapshotData != null && typeof sum === 'number') {
            if ('value' in snapshotData && typeof snapshotData.value === 'number') return sum + snapshotData.value;
            else if ('amount' in snapshotData && typeof snapshotData.amount === 'number') return sum + snapshotData.amount;
          }
          return sum;
        }, 0);
        setTotal(Number(totalValues));
      } else {
        setDataExist(false);
      }
    }).catch((error) => {
      setError(error.message);
    }).finally(() => {
      setDataLoading(false);
    })
  }, [databaseReference]);

  return { error, dataExist, data, total, dataLoading };
};

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