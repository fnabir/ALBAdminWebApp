import { OptionsInterface } from "@/lib/interfaces";

export const CallbackStatusOptions: OptionsInterface[] = [
	{value: 'New'},
	{value: 'Assigned'},
	{value: 'In Progress'},
	{value: 'Fixed'},
	{value: 'Cannot be fixed'}
];

export const OfferProductOptions: OptionsInterface[] = [
	{value: 'Passenger Lift'},
	{value: 'Cargo Lift'},
	{value: 'Hospital Lift'},
	{value: 'Capsule Lift'},
	{value: 'Escalator'},
	{value: 'Dumbwaiter'},
	{value: 'Generator'},
	{value: 'Other'}
]

export const OfferWorkOptions: OptionsInterface[] = [
	{value: 'Full Project'},
	{value: 'Servicing'},
	{value: 'Installation'},
	{value: 'Repair'}
];

export const CalendarEventOptions: OptionsInterface[] = [
	{value: 'Servicing'},
	{value: 'Callback'},
	{value: 'Other'}
];

export const ProjectSortOptions: OptionsInterface[] = [
	{value: 'name', label: 'Name' },
	{value: 'balance', label: 'Balance' },
	{value: 'register', label: 'Register' },
];

export const StaffSortOptions: OptionsInterface[] = [
	{value: 'name', label: 'Name' },
	{value: 'balance', label: 'Balance' },
	{value: 'position', label: 'Position' },
];

export const ProjectFilterOptions = [
	{value: 'none', label: 'None' },
	{value: '+', label: 'Outstanding' },
	{value: '0', label: 'Paid' },
	{value: '-', label: 'Overpaid' },
	{value: 'x', label: 'Cancelled' },
];

export const ProjectTransactionFilterOptions = [
	{value: 'none', label: 'None' },
	{value: '+', label: 'Expense' },
	{value: '-', label: 'Payment' },
];
  
export const ProjectTransactionOptions: OptionsInterface[] = [
	{value: '+', label: 'Expense' },
	{value: '-', label: 'Payment' },
];

export const ProjectExpenseOptions: OptionsInterface[] = [
	{value: 'Servicing'},
	{value: 'Callback'},
	{value: 'Spare Parts'},
	{value: 'Repairing'},
	{value: 'Others'},
];

export const ProjectPaymentOptions: OptionsInterface[] = [
	{value: 'Cash', label: 'Cash'},
	{value: 'Cheque', label: 'Cheque'},
	{value: 'Account Transfer', label: 'Account Transfer'},
	{value: 'Bank Transfer', label: 'Bank Transfer'},
	{value: 'CellFin', label: 'CellFin (Phone)'},
	{value: 'CellFin (Account)', label: 'CellFin (Account)'},
	{value: 'bKash', label: 'bKash'},
];

export const ProjectPaymentTypeOptions: OptionsInterface[] = [
	{value: 'notPaid', label: 'Not Paid'},
	{value: 'full', label: 'Full'},
	{value: 'partial', label: 'Partial'},
];

export const StaffTransactionTypeOptions: OptionsInterface[] = [
	{value: 'Advance'},
	{value: 'For Conveyance'},
	{value: 'House Rent'},
	{value: 'Payment'},
	{value: 'Salary'},
	{value: 'Bonus'},
	{value: 'Cashback'},
	{value: 'Others'},
];

export const PaymentInfoOptions: OptionsInterface[] = [
	{value: 'account', label: 'Account Transfer'},
	{value: 'bank', label: 'Bank Transfer'},
	{value: 'bKash', label: 'bKash'},
	{value: 'cash', label: 'Cash'},
	{value: 'cell', label: 'CellFin (Phone)'},
	{value: 'cellAccount', label: 'CellFin (Account)'},
	{value: 'cheque', label: 'Cheque'},
];