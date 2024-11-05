"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { database } from "@/firebase/config";
import {child, get, ref, update} from "firebase/database";
import { useEffect, useState } from "react";
import Input from "@/components/generic/Input";
import Button from "@/components/generic/Button";
import { UpdateUserDisplayName} from "@/firebase/database";
import { logout } from "@/firebase/auth";
import {errorMessage, successMessage} from "@/utils/functions";

export default function UpdateProfile() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [dataLoading, setDataLoading] = useState(true)
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [title, setTitle] = useState('');
    const [previousName, setPreviousName] = useState('');
    const [previousPhone, setPreviousPhone] = useState('');

    useEffect(() => {
        if (user && dataLoading) {
            get(child(ref(database), `info/user/${user.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setName(snapshot.val().name);
                    setPhone(snapshot.val().phone);
                    setTitle(snapshot.val().title);
                    setPreviousName(snapshot.val().name);
                    setPreviousPhone(snapshot.val().phone);
                }
            }).catch((error) => {
                console.error(error.message);
                errorMessage(error.message)
            }).finally(() => {
                setDataLoading(false);
            });
        }
    }, [dataLoading, user]);

    const handleSubmit = async () => {
        if (name == "") {
            setNameError("Please input name!")
            errorMessage(nameError);
        } else setNameError("")

        if (phone.length == 0 || phone == "") {
            setPhoneError("Please input phone number!")
            errorMessage(phoneError);
        } else if (phone.length < 11 || phone.length > 11) {
            setPhoneError("Phone number must be 11 digit!")
            errorMessage(phoneError);
        } else setPhoneError("")

        if (name != "" && phone.length == 11) {
            if (name == previousName && phone == previousPhone) {
                successMessage("No data has been changed.")
            } else {
                update(ref(database, `info/user/${user.uid}`), {
                    name: name,
                    phone: phone,
                }).then(() => {
                    successMessage("Data saved successfully!");
                    setPreviousName(name);
                    setPreviousPhone(phone);
                }).catch((error) => {
                    errorMessage(error.message);
                })
                if (user.username != name) {
                    UpdateUserDisplayName(name);
                    await logout();
                }
            }
        }
	};

    if (loading || dataLoading) return <Loading/>

    if (!loading && !user) return router.push("login")
    else {
        return (
        <Layout 
            pageTitle="User | Asian Lift Bangladesh"
            headerTitle="Update Profile">
            
            <div className="w-full max-w-lg mx-auto mt-5 items-center space-y-5">

                <Input
                    id="full-name"
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    message={"Change in display name requires you to login again"}
                    result={"error"}
                    resultMessage={nameError}
                />

                <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    value={user.email}
                    disabled
                />

                <Input
                    id="phone"
                    label="Phone Number"
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    message="*Required"
                    minLength={11}
                    maxLength={11}
                    result={"error"}
                    resultMessage={phoneError}
                />

                <Input
                    id="title"
                    label="Title"
                    type="text"
                    value={title}
                    disabled
                />

                <div className="w-full flex space-x-2">
                    <Button 
                        type= "submit"
                        label="Save"
                        onClick={handleSubmit}/>
                </div>
            </div>
        </Layout>
        );
    }
}
