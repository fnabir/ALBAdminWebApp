import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MdAdd, MdDelete, MdEditNote } from "react-icons/md";
import { Button } from "@/components/ui/button";
import InputText from "@/components/generic/InputText";
import InputDropDown from "@/components/generic/InputDropdown";
import { ButtonLoading } from "@/components/generic/ButtonLoading";
import { TransactionFormData, TransactionFormSchema } from "@/lib/schemas";
import { updateTransaction } from "@/lib/functions";
import { ProjectExpenseOptions, ProjectPaymentOptions, ProjectPaymentTypeOptions } from "@/lib/arrays";
import { format, parse } from "date-fns";
import { getDatabaseReference } from "@/lib/utils";
import { InputDate } from "@/components/generic/InputDate";
import { FullPaymentDataInterface, OptionsInterface, PartialPaymentDataInterface, ProjectTransactionInterface } from "@/lib/interfaces";
import { DataSnapshot, remove, update } from "firebase/database";
import { Separator } from "@/components/ui/separator";
import CustomRadioGroup from "@/components/generic/CustomRadioGroup";
import { ScrollArea } from "@/components/ui/scrollArea";

type Props = {
  projectName: string;
  transactionId: string;
  formVal: ProjectTransactionInterface;
  databaseRef: string;
  servicingCharge?: number;
  data?: DataSnapshot[];
  dataKeys?: string[];
  total?: number;
  paidDataOptions?: OptionsInterface[] | null;
};

export default function EditProjectTransactionDialog({ projectName, transactionId, formVal, databaseRef, servicingCharge=0, data, dataKeys, total=0, paidDataOptions }: Props) {
  const sign = formVal?.amount >= 0 ? "+" : "-";
  const [open, setOpen] = useState<boolean>(false);
	const [detailsLabel, setDetailsLabel] = useState<string>("Details");

  
  
  const [paymentType, setPaymentType] = useState<string|undefined>(!data || data.length == 0 ? 'notPaid' : ((data.length == 1 && formVal.amount <= total) ? 'full' : 'partial'));
  const [fullPaymentData, setFullPaymentData] = useState<FullPaymentDataInterface>({key: '', details: ''})
  const [partialDataSets, setPartialDataSets] = useState<PartialPaymentDataInterface[]>([
    { id: 1, key: '', details: "", amount: 0 },
  ]);

  const {
      register,
      setValue,
      reset,
      handleSubmit,
      formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
      resolver: zodResolver(TransactionFormSchema),
  });

  function addPartialDataSet() {
      if (partialDataSets.length < 10) {
          setPartialDataSets((prev) => [
              ...prev,
              { id: prev.length + 1, key: "", details: "", amount: 0 },
          ]);
      }
  }

  function removePartialDataSet (id: number) {
      setPartialDataSets((prev) => prev.filter((set) => set.id !== id));
  }
  
  const updatePaymentData = async(projectName: string, transactionId: string, formData: TransactionFormData, key: string, details: string, amount: number) => {
      const expenseRef = getDatabaseReference(`${databaseRef}/data/${key}`);
      const paymentRef = getDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`);
      const expenseData = {
          details: `${format(new Date(formData.date), "dd.MM.yy")} ${formData.title} ${formData.details ? `- ${formData.details}` : ""}`,
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

  const updatePartialPaymentData = async(projectName: string, transactionId: string, formData: TransactionFormData, partialDataSets: PartialPaymentDataInterface[]) => {
      partialDataSets.forEach((partialDataSet) => {
          if (partialDataSet.key && partialDataSet.key !== "Select" && partialDataSet.details !== "Select") {
              updatePaymentData(projectName, transactionId, formData, partialDataSet.key, partialDataSet.details, partialDataSet.amount);
          }
      })
  }
  
  const paymentDataCleanup = async(projectName: string,
                                    transactionId: string,
                                    formData: TransactionFormData,
                                    fullPaymentData: FullPaymentDataInterface,
                                    partialDataSets: PartialPaymentDataInterface[],
                                    dataKeys?: string[]) => {
      if (formData.amount >= 0) {
          if (dataKeys) {
              if (paymentType === "full") {
                  dataKeys.filter((key) => key !== fullPaymentData.key)
                    .forEach((key) => {
                        remove(getDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`))
                          .catch((error) => console.error(error.message))
                    })
              } else if (paymentType === "partial") {
                  dataKeys.filter((key) => !partialDataSets.some((dataSet) => dataSet.key === key))
                    .forEach((key) => {
                        remove(getDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`))
                          .catch((error) => console.error(error.message))
                    })
              } else {
                  dataKeys.forEach((key) => {
                      remove(getDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`))
                        .catch((error) => console.error(error.message))
                  })
              }
          }
      }
  }
  
  function handlePartialDataChange (id: number, field: "details" | "key", value: string) {
    setPartialDataSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, [field]: value } : set
      )
    );
  }

  function handlePartialDataAmountChange (id: number, value: number) {
    setPartialDataSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, amount: value } : set
      )
    );
  }

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    handleReset();
  };

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
      updateTransaction("project", projectName, transactionId, {
          title: data.title,
          details: data.details,
          amount: sign == "+" ? data.amount : data.amount * (-1),
      }).then(async () => {
          await paymentDataCleanup(projectName, transactionId, data, fullPaymentData, partialDataSets, dataKeys);
          if (sign === "+") {
              if (paymentType === "full") await updatePaymentData(projectName, transactionId, data, fullPaymentData.key, fullPaymentData.details, data.amount);
              else if (paymentType === "partial") await updatePartialPaymentData(projectName, transactionId, data, partialDataSets);
              else await remove(getDatabaseReference(`${databaseRef}/data`))
          }
      }).finally(() => {
          setOpen(false);
          window.location.reload();
      })
  }

  const handleReset = () => {
      reset();
      if (formVal.amount >= 0) {
          if (!data  || data.length == 0) {
              setPaymentType("notPaid");
          } else if (data.length == 1 && total >= formVal.amount) {
              setPaymentType("full");
              data.map((item) => {
                  setFullPaymentData({key: item.key!, details: item.val().details})
              })
          } else {
              setPaymentType("partial");
              data.map((item, index) => {
                  if (partialDataSets.length  < index + 1 ) addPartialDataSet();
                  handlePartialDataChange(index + 1, "key", item.key!);
                  handlePartialDataChange(index + 1, "details", item.val().details);
                  handlePartialDataAmountChange(index + 1, item.val().amount);
              })
          }
      }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button size="icon">
          <MdEditNote/>
        </Button>
      </DialogTrigger>
      <DialogContent className={"border-2 border-blue-500"}>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Click submit to save the changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} onReset={handleReset}>
          <InputDropDown label={sign === "+" ? "Expense Type" : "Payment Type"}
                        options={sign === "-" ? ProjectPaymentOptions : ProjectExpenseOptions}
                        defaultValue={formVal.title}
                        {...register('title')}
                        error={errors.title?.message || ""}
                        onChange={(e) => handleTitleChange(e.target.options[e.target.selectedIndex].text)}
                        required
          />
          <InputText label={detailsLabel}
                    defaultValue={formVal.details}
                    {...register("details")}
                    error={errors.details?.message || ""}
          />
          <div className="flex space-x-2">
            <InputText label="Amount"
                      type="number"
                      min={0}
                      defaultValue={Math.abs(formVal.amount)}
                      {...register("amount", {valueAsNumber: true})}
                      pre="৳"
                      sign={sign == "+" ? "" : sign}
                      error={errors.amount?.message || ""}
                      className="flex-1"
            />
            <InputDate label="Date"
                      type="date"
                      defaultValue={format(parse(formVal.date, "dd.MM.yy", new Date()), 'yyyy-MM-dd')}
                      {...register("date")}
                      error={errors.date?.message || ""}
                      className="flex-1"
            />
          </div>
          {
            paidDataOptions && sign === "+" &&
            <div>
              <Separator orientation={"horizontal"} className={"my-4"}/>
              <div className="flex space-x-2 justify-center items-center">
                <CustomRadioGroup id={'paymentType'} options={ProjectPaymentTypeOptions}
                                  onChange={(value) => setPaymentType(value)}
                                  defaultValue={paymentType}
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
									<ScrollArea className="h-60 overflow-auto text-center pb-4 pr-4">
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