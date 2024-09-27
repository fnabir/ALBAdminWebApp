import { ref, child, get } from "firebase/database";
import { database } from "@/firebase/config";
import { useEffect, useState } from "react";

export function getDatabaseValue(databaseReference: string): any {
  const [data, setData] = useState<any>();
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      get(child(ref(database), databaseReference)).then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
          setData([])
        }
      }).catch((error) => {
        console.error(error);
        setError(error)
      });
  
      setDataLoading(false);
    }
    
    fetchData();
  }, []);

  return { data, dataLoading, error };
}

export function readData(databaseReference: string): string {
  get(child(ref(database), databaseReference)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val() as String;
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return ""
}


export const getObjectDataWithTotal = (databaseReference: string) => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      get(child(ref(database), databaseReference)).then((snapshot) => {
        if (snapshot.exists()) {
          const snapshotDatas = snapshot.val();
          const itemsWithKeys = Object.entries(snapshotDatas).map(([key, value]) => ({ key, ...value }));
          setData(itemsWithKeys);
          const totalValues = Object.values(snapshotDatas).reduce((sum, snapshotData) => {
            return snapshotData.value ? sum + snapshotData.value : snapshotData.amount ? sum + snapshotData.amount : sum;
          }, 0);
          setTotal(totalValues)
        } else {
          console.log("No data available");
          setData([])
          setTotal(0)
        }
      }).catch((error) => {
        console.error(error);
        setError(error)
      });
  
      setDataLoading(false);
    }
    
    fetchData();
  }, []);

  return { data, total, dataLoading, error };
};