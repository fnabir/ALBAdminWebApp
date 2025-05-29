import { useEffect, useState, useMemo } from "react";
import { DataSnapshot } from "firebase/database";

export function useFilteredSortedBalance(
  balanceData: DataSnapshot[] | undefined,
  filter: string,
  sort: string
) {
  const [filteredData, setFilteredData] = useState<DataSnapshot[]>([]);

  useEffect(() => {
    if (!balanceData) return;

    const filtered = balanceData.filter((item) => {
      const { value, status } = item.val();
      switch (filter) {
        case "+":
          return value > 0;
        case "0":
          return value === 0;
        case "-":
          return value < 0;
        case "x":
          return status === "cancel";
        default:
          return true;
      }
    });

    setFilteredData(filtered);
  }, [balanceData, filter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      switch (sort) {
        case "name":
          return a.key!.localeCompare(b.key!);
        case "balance":
          return a.val().value - b.val().value;
        case "register":
          return a.val().register - b.val().register;
        case "position":
          return a.val().position - b.val().position;
        default:
          return 0;
      }
    });
  }, [filteredData, sort]);

  return sortedData;
}