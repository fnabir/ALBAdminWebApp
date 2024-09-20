import { DatabaseReference, get } from "firebase/database";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"; 

export function readData(ref:DatabaseReference) : any {
  get(ref).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No data available');
      return "";
    }
  }).catch((error) => {
    console.log(error);
    return "";
  });
  console.log("Not found")
  return ""
}

export function formatCurrency(
    initialValue: number,
    options?: {
      precision?: number;
    }
  ): string {
    const { precision } = Object.assign(
      {
        precision: 0
      },
      options
    );

    var signed: Boolean = true

    if (initialValue >= 0) {
      signed = false
    }
  
    const str = String(Math.abs(initialValue));
  
    const splited = str.split('.');
    const cents =
      splited.length > 1
        ? String(splited[1]).padEnd(precision, '0')
        : '0'.repeat(precision);
    const value = splited[0];
  
    var chunks: string[] = [];
  
    for (let i = value.length; i > 0; i -= 3) {
      chunks.push(value.substring(i, i - 3));
    }
  
    chunks.reverse();
  
    return `${signed ? '-' : '' } ৳ ${chunks.join(',')}
    ${precision > 0 ? '.' + cents : ''}`;
  }