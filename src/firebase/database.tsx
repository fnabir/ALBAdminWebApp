import { ref, child, get } from "firebase/database";
import { database } from "@/firebase/config";
import { useEffect, useState } from "react";

export function getDataExist(databaseReference: string): any {
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
  }, []);

  return { dataExist, dataLoading, error };
}


export function getDataCount(databaseReference: string): any {
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
  }, []);

  return { dataCount, dataLoading, error };
}


export function getDatabaseValue(databaseReference: string): any {
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
  }, []);

  return { data, dataLoading, error };
}


export const getObjectData = (databaseReference: string) => {
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
          const itemsWithKeys = Object.entries(snapshotDatas).map(([key, value]) => ({ key, ...value, childCount: Object.keys(value).length }));
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
  }, []);

  return { dataExist, data, dataLoading, error };
};


export const getObjectDataWithTotal = (databaseReference: string) => {
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
          const itemsWithKeys = Object.entries(snapshotDatas).map(([key, value]) => ({ key, ...value, childCount: Object.keys(value).length }));
          setData(itemsWithKeys);
          const totalValues = Object.values(snapshotDatas).reduce((sum, snapshotData) => {
            return snapshotData.value ? sum + snapshotData.value : snapshotData.amount ? sum + snapshotData.amount : sum;
          }, 0);
          setTotal(totalValues);
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
  }, []);

  return { dataExist, data, total, dataLoading, error };
};