import {formatCurrency, getDatabaseReference, getTotalValue} from "@/lib/utils";
import {MdDelete, MdEditNote} from "react-icons/md";
import React, {useState} from "react";
import {useList, useListKeys} from "react-firebase-hooks/database";
import {Card} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {deleteTransaction, updateTransaction} from "@/lib/functions";
import {TransactionFormData, transactionSchema} from "@/lib/schemas";
import CustomInput from "@/components/generic/CustomInput";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {format, parse} from "date-fns";
import CustomSeparator from "@/components/generic/CustomSeparator";
import {FullPaymentDataType, options, PartialPaymentDataType} from "@/lib/types";
import CustomRadioGroup from "@/components/generic/CustomRadioGroup";
import {projectPaymentTypeOptions} from "@/lib/arrays";
import CustomDropDown from "@/components/generic/CustomDropDown";
import {remove, update} from "firebase/database";

interface Props {
    projectName: string,
    transactionId: string,
    title: string,
    details?: string,
    amount: number,
    date: string,
    userAccess: string,
    paidDataOptions?:options[]
}

const CardTransactionProject: React.FC<Props> = ({
    projectName, transactionId, title, details, amount, date, userAccess, paidDataOptions
}) => {
    const [editDialog, setEditDialog] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const databaseRef = `transaction/project/${projectName}/${transactionId}`;
    const [data] = useList(getDatabaseReference(`${databaseRef}/data`));
    const [dataKeys] = useListKeys(getDatabaseReference(`${databaseRef}/data`));
    const total: number = getTotalValue(data, "amount");
    const bg = amount <= 0 || amount == total ? 'bg-green-900' : amount > 0 && amount < total ? 'bg-yellow-900' : 'bg-red-900';

    const {
        register,
        getValues,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: { type: amount < 0 ? "-" : "+", title: title, details: details, amount: Math.abs(amount), date: format(parse(date, "dd.MM.yy", new Date()), 'yyyy-MM-dd') },
    });

    const [paymentType, setPaymentType] = useState<string>(!data || data.length == 0 ? 'notPaid' : ((data.length == 1 && amount <= total) ? 'full' : 'partial'));
    const [fullPaymentData, setFullPaymentData] = useState<FullPaymentDataType>({key: '', details: ''})
    const [partialDataSets, setPartialDataSets] = useState<PartialPaymentDataType[]>([
        { id: 1, key: '', details: "", amount: 0 },
    ]);

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

    const updatePaymentData = async(projectName: string, transactionId: string, formData: TransactionFormData, key: string, details: string, amount: number) => {
        const expenseRef = getDatabaseReference(`${databaseRef}/data/${key}`);
        const paymentRef = getDatabaseReference(`transaction/project/${projectName}/${key}/data/${transactionId}`);
        const expenseData = {
            details: `${format(new Date(formData.date), "dd.MM.yy")} ${formData.title} - ${formData.details}`,
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

    const updatePartialPaymentData = async(projectName: string, transactionId: string, formData: TransactionFormData, partialDataSets: any[]) => {
        partialDataSets.forEach((partialDataSet) => {
            if (partialDataSet.key && partialDataSet.key !== "Select" && partialDataSet.details !== "Select") {
                updatePaymentData(projectName, transactionId, formData, partialDataSet.key, partialDataSet.details, partialDataSet.amount);
            }
        })
    }

    const paymentDataCleanup = async(projectName: string,
                                     transactionId: string,
                                     formData: TransactionFormData,
                                     fullPaymentData: FullPaymentDataType,
                                     partialDataSets: PartialPaymentDataType[],
                                     dataKeys?: string[]) => {
        if (formData.type === "+") {
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

    const onSubmit = async (data: TransactionFormData) => {
        updateTransaction("project", projectName, transactionId, {
            title: data.title,
            details: data.details,
            amount: data.type == "+" ? data.amount : data.amount * (-1),
        }).then(async () => {
            await paymentDataCleanup(projectName, transactionId, data, fullPaymentData, partialDataSets, dataKeys);
            if (data.type === "+") {
                if (paymentType === "full") await updatePaymentData(projectName, transactionId, data, fullPaymentData.key, fullPaymentData.details, data.amount);
                else if (paymentType === "partial") await updatePartialPaymentData(projectName, transactionId, data, partialDataSets);
                else await remove(getDatabaseReference(`${databaseRef}/data`))
            }
        }).finally(() => {
            setEditDialog(false);
            window.location.reload();
        })
    }

    const handleReset = () => {
        reset();
        if (amount >= 0) {
            if (!data  || data.length == 0) {
                setPaymentType("notPaid");
            } else if (data.length == 1 && total >= amount) {
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

    const handleDelete = () => {
        deleteTransaction("project", projectName, transactionId, dataKeys).finally(() => {
            setDeleteDialog(false);
            window.location.reload();
        });
    }

    return (
        <Card className={"flex w-full p-1 text-start " + bg + " hover:bg-opacity-80 items-center"}>
            <div className="flex-col w-full items-center pl-2 md:pl-6 mr-1 text-white">
                <div className="w-full mx-auto flex items-center justify-between text-sm md:text-base gap-2 md:gap-6">
                    <div className="font-mono">
                        {date}
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">
                            {title}
                            {details && <span className={"font-medium"}> - {details}</span> }
                        </div>
                    </div>
                    <div className="items-center md:text-2xl font-mono font-medium sm:mt-0">
                        {formatCurrency(amount)}
                    </div>
                </div>
                <div className={"border-0 bg-black rounded-md bg-opacity-50"}>
                    {
                        data &&
                            data.sort((a, b) => b.key!.localeCompare(a.key!)).map((item) => {
                                    const snapshot = item.val();
                                    return (
                                        <div className="w-full flex space-x-6 px-2 text-sm pt-1" key={item.key}>
                                            <div className="font-mono">{(snapshot.details).substring(0, 8)}</div>
                                            <div className="flex-1">{(snapshot.details).substring(8,)}</div>
                                            <div className={"font-mono"}>{formatCurrency(snapshot.amount)}</div>
                                        </div>
                                    )
                                })
                            }
                        
                </div>
            </div>

            <div className={"flex mx-2 space-x-2"}>
                <Dialog open={editDialog} onOpenChange={setEditDialog}>
                    <DialogTrigger asChild>
                        <button onClick={handleReset}
                          className={"p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70"}>
                            <MdEditNote color={"white"} size={24}/>
                        </button>
                    </DialogTrigger>
                    <DialogContent className={"border border-blue-500"}>
                        <DialogHeader>
                            <DialogTitle>Edit Transaction</DialogTitle>
                            <DialogDescription>
                                Click save to save the changes.
                            </DialogDescription>
                        </DialogHeader>
                        <CustomSeparator orientation={"horizontal"} className={"mb-2"}/>
                        <form onSubmit={handleSubmit(onSubmit)}
                              className="flex-col space-y-4">
                            <CustomInput id="title"
                                         type="text"
                                         label={"Title"}
                                         {...register('title')}
                                         helperText={errors.title ? errors.title.message : ""}
                                         color={errors.title ? "error" : "default"}
                            />
                            <CustomInput id="details"
                                         type="text"
                                         label={"Details"}
                                         {...register('details')}
                                         helperText={errors.details ? errors.details.message : ""}
                                         color={errors.details ? "error" : "default"}
                            />
                            <CustomInput id="amount"
                                         type="number"
                                         label="Amount"
                                         min={0}
                                         step={1}
                                         {...register("amount", {valueAsNumber: true})}
                                         pre="৳"
                                         sign={getValues("type") == "-" ? "-" : ""}
                                         helperText={errors.amount ? errors.amount.message : ""}
                                         color={errors.amount ? "error" : "default"}
                                         required
                            />
                            <CustomInput id="date"
                                         type="date"
                                         label="Date"
                                         helperText={errors.date ? errors.date.message : ""}
                                         color={errors.date ? "error" : "default"}
                                         {...register("date")}
                                         required
                                         disabled
                            />
                            {paidDataOptions && getValues("type") === "+" &&
                              <div>
                                  <CustomSeparator orientation={"horizontal"} className={"my-4"}/>
                                  <CustomRadioGroup id={'paymentType'} options={projectPaymentTypeOptions}
                                                    onChange={(value) => setPaymentType(value)}
                                                    defaultValue={paymentType}
                                                    className="mb-4"
                                  />
                                  {
                                      paymentType == "full" ?
                                        <CustomDropDown id="fullPaymentDate"
                                                        label="Payment Date"
                                                        options={paidDataOptions}
                                                        value={fullPaymentData.key}
                                                        onChange={(e) => setFullPaymentData({key: e.target.value, details: e.target.options[e.target.selectedIndex].text})}
                                        />
                                        : paymentType == "partial" ?
                                          <div className="text-center">
                                              {
                                                partialDataSets.length < 10 && (
                                                  <Button type="button" variant="accent" size="lg" onClick={addPartialDataSet}>Add</Button>
                                                )
                                              }
                                              {
                                                  partialDataSets.map((set, index) => (
                                                    <div key={set.id} className={`flex gap-x-2`}>
                                                        <CustomDropDown id={`paymentDate${index + 1}`} label={`Payment Date ${index + 1}`}
                                                                        className={`flex-[1_1_73%]`} options={paidDataOptions}
                                                                        value={partialDataSets[index].key}
                                                                        onChange={(e) => {
                                                                            handlePartialDataChange(set.id, "details", e.target.options[e.target.selectedIndex].text);
                                                                            handlePartialDataChange(set.id, "key", e.target.value);
                                                                        }}
                                                        />
                                                        <CustomInput id={`paymentAmount${index + 1}`} label={`Amount ${index + 1}`}
                                                                     type="number" pre={`৳`} className={`flex-[1_1_27%]`}
                                                                     value={partialDataSets[index].amount}
                                                                     onChange={(e) => handlePartialDataAmountChange(set.id, Number(e.target.value))}
                                                        />
                                                        <Button variant="destructive" className="mt-[18px]" size="icon" onClick={() => removePartialDataSet(set.id)}>
                                                            <MdDelete/>
                                                        </Button>
                                                    </div>
                                                  ))
                                              }
                                          </div>
                                          : null
                                  }
                              </div>
                            }
                            <DialogFooter className={"sm:justify-center pt-8"}>
                                <DialogClose asChild>
                                    <Button type="button" size="lg" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="button" size="lg" variant="secondary" onClick={handleReset}>Reset</Button>
                                <Button type="submit" size="lg" variant="accent">Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {userAccess === "admin" &&
                  <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                    <DialogTrigger asChild>
                        <button className={"p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70"}>
                            <MdDelete color={"white"} size={24}/>
                        </button>
                    </DialogTrigger>
                    <DialogContent className={"border border-destructive"}>
                        <DialogHeader>
                            <DialogTitle>Delete Transaction</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete the transaction.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className={"mx-auto"}>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                }
            </div>
        </Card>
    )
}

export default CardTransactionProject;