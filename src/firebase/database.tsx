import { ref, child, get, remove, set, update } from "firebase/database";
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
    const fetchData = async () => {
      get(child(ref(database), databaseReference)).then((snapshot) => {
        if (snapshot.exists()) {
          setDataExist(true)
        }
      }).catch((error) => {
        console.error(error.message);
        setError(error.message)
      });
      setDataLoading(false);
    }

    fetchData();
  }, [databaseReference]);

  return { dataExist, dataLoading, error };
}


export function GetDataCount(databaseReference: string): any {
  const [dataCount, setDataCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      get(child(ref(database), databaseReference)).then((snapshot) => {
        if (snapshot.exists()) {
          setDataCount(snapshot.size)
        } else setDataCount(0)
      }).catch((error) => {
        console.error(error.message);
        setError(error.message)
      });
      setDataLoading(false);
    }
    
    fetchData();
  }, [databaseReference]);

  return { dataCount, dataLoading, error };
}


export function GetDatabaseValue(databaseReference: string): any {
  const [dataExist, setDataExist] = useState(false);
  const [data, setData] = useState<any>();
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      get(child(ref(database), databaseReference)).then((snapshot) => {
        if (snapshot.exists()) {
          setDataExist(true)
          setData(snapshot.val());
        } else {
          console.log("No data available");
          setData([])
        }
      }).catch((error) => {
        console.error(error.message);
        setError(error.message)
      });
  
      setDataLoading(false);
    }
    
    fetchData();
  }, [databaseReference]);

  return { dataExist, data, dataLoading, error };
}


export const GetObjectData = (databaseReference: string) => {
  const [dataExist, setDataExist] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      get(child(ref(database), databaseReference)).then((snapshot) => {
        if (snapshot.exists()) {
          setDataExist(true)
          const snapshotDatas = snapshot.val();
          const itemsWithKeys = Object.entries(snapshotDatas).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return { key, ...value, childCount: Object.keys(value).length };
            } else {
              return null;
            }
          });
          setData(itemsWithKeys);
        } else {
          console.log("No data available");
          setData([])
        }
      }).catch((error) => {
        console.error(error.message);
        setError(error.message)
      });
  
      setDataLoading(false);
    }
    
    fetchData();
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
    const fetchData = async () => {
      get(child(ref(database), databaseReference)).then((snapshot) => {
        if (snapshot.exists()) {
          setDataExist(true);
          const snapshotDatas = snapshot.val();
          const itemsWithKeys = Object.entries(snapshotDatas).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return { key, ...value, childCount: Object.keys(value).length };
            } else {
              return null;
            }
          });
          setData(itemsWithKeys);
          const totalValues = Object.values(snapshotDatas).reduce((sum, snapshotData) => {
            if (typeof snapshotData === 'object' && snapshotData != null && typeof sum === 'number') {
              if ('value' in snapshotData && typeof snapshotData.value === 'number') return sum + snapshotData.value;
              else if ('amount' in snapshotData && typeof snapshotData.amount === 'number') return sum + snapshotData.amount;
            }
            return sum;
          }, 0);
          setTotal(Number(totalValues));
        } else {
          console.log("No data available");
          setData([]);
          setTotal(0);
        }
      }).catch((error) => {
        console.error(error.message);
        setError(error.message)
      });
  
      setDataLoading(false);
    }
    
    fetchData();
  }, [databaseReference]);

  return { dataExist, data, total, dataLoading, error };
};


export function GetUserRole(userUid: string): any {
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      get(child(ref(database), "info/user/" + userUid)).then((snapshot) => {
        if (snapshot.exists()) {
          setRole(snapshot.val().role);
        } else {
          console.log("No data available");
          setRole("")
        }
      }).catch((error) => {
        console.error(error.message);
      });
    }
    
    fetchData();
  }, [userUid]);

  return role;
}


export const SetData = (databaseReference: string, data: object) => {
  const [total, setTotal] = useState(0);
  const [dataUploading, setDataUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const writeData = async () => {
      setDataUploading(true);

      set(ref(database, databaseReference), data)
      .then(() => {
        console.log("Data saved successfully!");
      })
      .catch((error) => {
        console.error(error.message);
        setError(error.message);
      })
      .finally(() => {
        setDataUploading(false);
      })
    };

    writeData();
  }, [databaseReference, data]);
};


export const UpdateData = (databaseReference: string, data: object) => {
  const [total, setTotal] = useState(0);
  const [dataUploading, setDataUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateData = async () => {
      setDataUploading(true);

      update(ref(database, databaseReference), data)
      .then(() => {
        console.log("Data saved successfully!");
      })
      .catch((error) => {
        console.error(error.message);
        setError(error.message);
      })
      .finally(() => {
        setDataUploading(false);
      })
    };

    updateData();
  }, [databaseReference, data]);
};


export const DeleteData = (databaseReference: string) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const removeData = async () => {
      setIsDeleting(true);

      try {
        await remove(child(ref(database), databaseReference));
        console.log('Data deleted successfully!');
      } catch (error) {
        console.error('Error deleting data:', error);
        setError(String(error));
      } finally {
        setIsDeleting(false);
      }
    };

    removeData();
  }, [databaseReference]);
  return { isDeleting, error };
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