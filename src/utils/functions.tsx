import { toast } from "react-toastify";

export const successMessage = (message:string) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
	});
};

export const errorMessage = (message:string) => {
	toast.error(message, {
		position: "top-right",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
	});
};

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
  
    const split = str.split('.');
    const cents =
      split.length > 1
        ? String(split[1]).padEnd(precision, '0')
        : '0'.repeat(precision);
    const value = split[0];
  
    var chunks: string[] = [];
  
    for (let i = value.length; i > 0; i -= 3) {
      chunks.push(value.substring(i, i - 3));
    }
  
    chunks.reverse();
  
    return `${signed ? '-' : '' } ৳ ${chunks.join(',')}
    ${precision > 0 ? '.' + cents : ''}`;
  }


export function removeDuplicateData(data?: any[]) : any[] {
	const seen = new Set<string>();
	return data? data.filter((item) => {
		if (seen.has(item.key)) {
			return false;
		}
		seen.add(item.key);
		return true;
	}) : [];
}