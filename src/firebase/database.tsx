import { ref, child, get } from "firebase/database";
import { database } from "@/firebase/config";
import { useEffect, useState } from "react";

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
          console.log(snapshot.size)
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

  return { data, dataLoading, error };
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