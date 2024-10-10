import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from '@/firebase/config';

const firestore = getFirestore(app);


export const GetFirestoreData = (collectionName: string, documentName: string | undefined = "", key: string | undefined = "", fieldName: string | undefined = "") => {
  const [data, setData] = useState<any>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = documentName ? (key ? (fieldName ? doc(firestore, collectionName, documentName, key, fieldName) : doc(firestore, collectionName, documentName, key)) : doc(firestore, collectionName, documentName)) : doc(firestore, collectionName)
      const snapshot = await getDoc(docRef);

      try {
        if (snapshot.exists()) {
          const snapshotData = snapshot.data();
          setData(snapshotData)
        } else {
          setData([])
        } 
      } catch (error: any) {
        console.log(error)
        setError(error)
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [collectionName,documentName,key,fieldName]);
  
  return { data, dataLoading, error };
};


export const GetFirestoreMapData = (collectionName: string, documentName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, collectionName, documentName)
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const snapshotData = snapshot.data();
          if (snapshotData) {
            const itemsWithKeys = Object.entries(snapshotData).map(([key, value]) => ({ key, ...value }));
            setData(itemsWithKeys);
          } else setData([])
          console.log(snapshotData)
        } else {
          console.log("No data available.")
        }
      } catch (error: any) {
        console.log(error)
        setError(error)
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [collectionName,documentName]);

  return { data, dataLoading, error };
};

export const GetFirestoreMapDataWithTotal = (collectionName: string, documentName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, collectionName, documentName)
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const snapshotDatas = snapshot.data();
          const itemsWithKeys = Object.entries(snapshotDatas).map(([key, value]) => ({ key, ...value }));
          setData(itemsWithKeys);
          const totalValues = Object.values(snapshotDatas).reduce((sum, snapshotData) => {
            return sum + snapshotData.value;
          }, 0);
          setTotal(totalValues)
        } else {
          console.log("No data available.")
          setData([])
        }
      } catch (error: any) {
        console.log(error)
        setError(error)
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [collectionName,documentName]);

  return { data, total, dataLoading, error };
};