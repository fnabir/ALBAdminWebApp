import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MdAdd, MdAddCircle, MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import InputText from "@/components/generic/InputText";
import InputDropDown from "@/components/generic/InputDropdown";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import { TransactionFormData, TransactionFormSchema } from "@/lib/schemas";
import { updateLastUpdateDate } from "@/lib/functions";
import { ProjectExpenseOptions, ProjectPaymentOptions, ProjectPaymentTypeOptions, ProjectTransactionOptions } from "@/lib/arrays";
import { format } from "date-fns";
import { generateDatabaseKey, getDatabaseReference, showToast } from "@/lib/utils";
import { InputDate } from "@/components/generic/InputDate";
import { FullPaymentDataInterface, OptionsInterface, PartialPaymentDataInterface } from "@/lib/interfaces";
import { set, update } from "firebase/database";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scrollArea";
import { RadioButtonGroup } from "../generic/RadioButtonGroup";

type Props = {
  projectName: string;
  paidDataOptions?: OptionsInterface[];
  servicingCharge?: number;
};

export default function AddProjectTransactionDialog({ projectName, paidDataOptions, servicingCharge }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [sign, setSign] = useState<string>("+");
  const [titleLabel, setTitleLabel] = useState<string>("Expense Type");
	const [detailsLabel, setDetailsLabel] = useState<string>("Details");
	const [paymentType, setPaymentType] = useState<string>("notPaid");
  const [fullPaymentData, setFullPaymentData] = useState<FullPaymentDataInterface>({key: '', details: ''})
  const [partialDataSets, setPartialDataSets] = useState<PartialPaymentDataInterface[]>([
    { id: 1, key: '', details: "", amount: 0 },
  ]);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionFormSchema),
  });

  const addPartialDataSet = () => {
    if (partialDataSets.length < 10) {
      setPartialDataSets((prev: PartialPaymentDataInterface[]) => [
        ...prev,
        { id: prev.length + 1, key: "", details: "", amount: 0 },
      ]);
    }
  };

  const removePartialDataSet = (id: number) => {
    setPartialDataSets((prev) => prev.filter((set) => set.id !== id));
  };
  
  function handlePartialDataChange (
    id: number,
    field: "details" | "key",
    value: string,
  ) {
    setPartialDataSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, [field]: value } : set
      )
    );
  }

  function handlePartialDataAmountChange (
    id: number,
    value: number,
  ) {
    setPartialDataSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, amount: value } : set
      )
    );
  }

  const updatePaymentData = (data: TransactionFormData, transactionId: string, key: string, details: string, amount: number) => {
		const expenseRef = getDatabaseReference(`transaction/project/${projectName}/${transactionId}/data/${key}`);
		const paymentRef = getDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`);
		const expenseData = {
			details: `${format(new Date(data.date), "dd.MM.yy")} ${data.title} - ${data.details}`,
			amount: amount,
		}
		const paymentData = {
			details: details,
			amount: amount,
		}
		update(expenseRef, paymentData)
			.catch((error) => console.error(`Payment Data in Expense Transaction: ${error.message}`))
		update(paymentRef, expenseData)
			.catch((error) => console.error(`Expense Data in Payment Transaction: ${error.message}`))
	}

	const updatePartialPaymentData = async(data: TransactionFormData, newKey: string) => {
		partialDataSets.forEach((partialDataSet) => {
			if (partialDataSet.key && partialDataSet.key !== "Select" && partialDataSet.details !== "Select") {
				updatePaymentData(data, newKey, partialDataSet.key, partialDataSet.details, partialDataSet.amount);
			}
		})
	}

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    reset();
  };

  const handleTypeChange = (value:string) => {
		setSign(value);
		setValue('title', "Select");
		if (value === "-") setTitleLabel("Payment Type")
		else setTitleLabel("Expense Type")
	}

  const handleTitleChange = (label:string) => {
    switch (label) {
      case "Cash":
        setDetailsLabel("Receiver");
        setValue("details", "");
        break;
      case "Cheque":
      case "Bank Transfer":
        setDetailsLabel('Bank Name, Branch');
        setValue("details", "");
        break;
      case "Account Transfer":
      case "CellFin (Account)":
        setDetailsLabel('Account Number');
        setValue("details", "Acc No.**");
        break;
      case "CellFin (Phone)":
        setDetailsLabel('Phone Number');
        setValue("details", "");
        break;
      case "bKash":
        setDetailsLabel('bKash Number');
        setValue("details", "");
        break;
      case "Servicing":
        setDetailsLabel("Month");
        setValue("details", "");
        setValue("amount", servicingCharge ? servicingCharge : 0);
        break;
      case "Spare Parts":
        setDetailsLabel('Name of Parts');
        setValue("details", "");
        break;
      default:
        setDetailsLabel("Details");
        setValue("details", "");
        break;
    }
  }

  const onSubmit = async (data: TransactionFormData) => {
		if (sign == "+" && paymentType == "full" && (!fullPaymentData || !fullPaymentData.key || fullPaymentData.details === "Select" || fullPaymentData.details === "")) {
			showToast("Error", "Please select a valid payment date", "error");
		} else {
			let paymentData = {}
			if (sign === "+") {
				if (paymentType == "full") {
					paymentData = {
						[fullPaymentData.key] : {
							details: fullPaymentData.details,
							amount: data.amount,
						}
					}
				} else if (paymentType == "partial") {
					paymentData = partialDataSets.reduce((partialDataObject, partialData) => {
						if (partialData.key && partialData.key !== "Select" && partialData.details !== "Select") {
							partialDataObject[partialData.key] = {
								amount: partialData.amount,
								details: partialData.details,
							};
						}
						return partialDataObject;
					}, {} as { [key: string]: { amount: number; details: string } });
				}
			}

			const newKey: string = `${format(new Date(data.date), "yyMMdd")}${generateDatabaseKey(`transaction/project/${projectName}`)}`;
			await set(getDatabaseReference(`transaction/project/${projectName}/${newKey}`), {
				title: data.title,
				details: data.details,
				amount: sign == "+" ? data.amount : data.amount * (-1),
				date: format(new Date(data.date), "dd.MM.yy"),
				data: paymentData,
			}).then(() => {
				if (paymentType === "full") {
					updatePaymentData(data, newKey, fullPaymentData.key, fullPaymentData.details, data.amount)
				} else if (paymentType === "partial") {
					updatePartialPaymentData(data, newKey)
						.catch((error) => {
							console.log(error);
							showToast("Error", "Failed to update payment data", "error");
						});
				}
				updateLastUpdateDate("project", projectName).catch((error) => {
					console.error(error.message());
					showToast(error.name, "Failed to update the last update date", "error");
				});
			}).finally(() => {
				setOpen(false);
				window.location.reload();
			});
		}
	};

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="accent" className="pr-2">
          <MdAddCircle/> Add New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className={"border-2 border-blue-500"}>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Click submit to add the new transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset}>
          <RadioButtonGroup options={ProjectTransactionOptions}
                            onChange={(value) => handleTypeChange(value)}
                            value={"+"}
          />
          <InputDropDown label={titleLabel}
                        options={sign === "-" ? ProjectPaymentOptions : ProjectExpenseOptions}
                        {...register('title')}
                        error={errors.title?.message || ""}
                        onChange={(e) => handleTitleChange(e.target.options[e.target.selectedIndex].text)}
                        required
          />
          <InputText label={detailsLabel}
                    {...register("details")}
                    error={errors.details?.message || ""}
          />
          <div className="flex space-x-2">
            <InputText label="Amount"
                      type="number"
                      min={0}
                      {...register("amount", {valueAsNumber: true})}
                      pre="৳"
                      sign={sign == "+" ? "" : sign}
                      error={errors.amount?.message || ""}
                      className="flex-1"
            />
            <InputDate label="Date"
                      type="date"
                      {...register("date")}
                      error={errors.date?.message || ""}
                      className="flex-1"
            />
          </div>
          {
            paidDataOptions && sign === "+" && <div>
              <Separator orientation={"horizontal"} className={"my-4"}/>
							<div className="flex space-x-2 justify-center items-center">
                <RadioButtonGroup options={ProjectPaymentTypeOptions}
                                  onChange={(value) => setPaymentType(value)}
                                  value={paymentType}
                />
                {
                  paymentType === "partial" && partialDataSets.length < 10 && (
                    <Button type="button" variant="accent" size="icon" onClick={addPartialDataSet}><MdAdd/></Button>
                  )
                }
              </div>
							{
								paymentType == "full" ?
                  <InputDropDown label="Payment Date"
                    options={paidDataOptions}
                    onChange={(e) => setFullPaymentData({key: e.target.value, details: e.target.options[e.target.selectedIndex].text})}
                  />
								: paymentType == "partial" ?
									<ScrollArea className="max-h-80 overflow-auto text-center pr-2 pb-4">
										{
											partialDataSets.map((set, index) => (
												<div key={set.id} className={`flex gap-x-2`}>
                          <InputDropDown label={`Payment Date ${index + 1}`}
                            options={paidDataOptions}
                            className={`flex-[1_1_73%]`}
                            onChange={(e) => {
                              handlePartialDataChange(set.id, "details", e.target.options[e.target.selectedIndex].text);
                              handlePartialDataChange(set.id, "key", e.target.value);
                            }}
                          />
                          <InputText label={`Amount ${index + 1}`}
                            type="number"
                            pre="৳"
                            className={`flex-[1_1_27%]`}
                            onChange={(e) => handlePartialDataAmountChange(set.id, Number(e.target.value))}
                          />
                          <Button variant="destructive" className="mt-[18px]" size="icon" onClick={() => removePartialDataSet(set.id)}>
                            <MdDelete/>
                          </Button>
                        </div>
                      ))
                    }
                  </ScrollArea>
                : null
              }
            </div>
          }
          <DialogFooter className={"sm:justify-center pt-2 lg:pt-6"}>
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
            <ButtonLoading
              type="submit"
              variant="accent"
              loading = {isSubmitting}
              text="Submit"
              loadingText="Submitting..."/>
            <Button type="reset" variant="secondary">Reset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}