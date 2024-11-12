"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { database } from "@/firebase/config";
import {child, get, ref, update} from "firebase/database";
import { useEffect, useState } from "react";
import CustomInput from "@/components/generic/CustomInput";
import CustomButton from "@/components/generic/CustomButton";
import { UpdateUserDisplayName} from "@/firebase/database";
import { logout } from "@/firebase/auth";
import {errorMessage, successMessage} from "@/utils/functions";

export default function UpdateProfile() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [dataLoading, setDataLoading] = useState(true)
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
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
            errorMessage("Please input name!");
        }

        if (phone.length == 0 || phone == "") {
            errorMessage("Please input phone number!");
        } else if (phone.length != 11) {
            errorMessage("Phone number must be 11 digit!");
        }

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

                <CustomInput
                    id="full-name"
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    helperText={name == "" ? "Please input name!" : name != previousName ? "Change in display name requires you to login again" : ""}
                    color={name == "" ? "error" : "default"}
                />

                <CustomInput
                    id="email"
                    label="Email Address"
                    type="email"
                    value={user.email}
                    disabled
                />

                <CustomInput
                    id="phone"
                    label="Phone Number"
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    minLength={11}
                    maxLength={11}
                    minNumber={0}
                    maxNumber={99999999999}
                    color={phone.length != 11 ? "error" : "default"}
                    helperText={phone.length == 0 || phone == "" ? "Please input phone number!" : phone.length != 11 ? "Phone number must be 11 digit!" : ""}
                />

                <CustomInput
                    id="title"
                    label="Title"
                    type="text"
                    value={title}
                    disabled
                />

                <div className="w-full flex space-x-2">
                    <CustomButton 
                        type= "submit"
                        label="Save"
                        onClick={handleSubmit}/>
                </div>
            </div>
        </Layout>
        );
    }
}
