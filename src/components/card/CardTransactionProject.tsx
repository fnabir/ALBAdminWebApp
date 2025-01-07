import {formatCurrency} from "@/lib/utils";
import {MdDelete, MdEditNote} from "react-icons/md";
import React, { useState} from "react";
import {useList, useListKeys} from "react-firebase-hooks/database";
import {getDatabaseReference, getTotalValue} from "@/lib/utils";
import {Card} from "@/components/ui/card";
import { Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter, DialogClose} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {deleteTransaction, updateTransaction} from "@/lib/functions";
import {TransactionFormData, transactionSchema} from "@/lib/schemas";
import CustomInput from "@/components/generic/CustomInput";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {format, parse} from "date-fns";
import CustomSeparator from "@/components/generic/CustomSeparator";
import {options} from "@/lib/types";

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
    projectName, transactionId, title, details, amount, date, userAccess
}) => {
    const [editDialog, setEditDialog] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const databaseRef = `transaction/project/${projectName}/${transactionId}`;
    const [data] =  useList(getDatabaseReference(`${databaseRef}/data`));
    const [dataKeys] = useListKeys(getDatabaseReference(`${databaseRef}/data`));
    const total = getTotalValue(data, "amount");
    const bg = amount <= 0 || amount == total? 'bg-green-900' : amount > 0 && amount < total ? 'bg-yellow-900' : 'bg-red-900';

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

    const onSubmit = (data: TransactionFormData) => {
        updateTransaction("project", projectName, transactionId, {
            title: data.title,
            details: data.details,
            amount: data.type == "+" ? data.amount : data.amount * (-1),
            date: format(new Date(data.date), "dd.MM.yy"),
        }).finally(() => {
            setEditDialog(false);
            window.location.reload();
        })
    }

    const handleReset = () => {
        reset();
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
                            <CustomDateTimeInput id="date"
                                                 type="date"
                                                 label="Date"
                                                 helperText={errors.date ? errors.date.message : ""}
                                                 color={errors.date ? "error" : "default"}
                                                 {...register("date")}
                                                 required
                                                 disabled
                            />
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