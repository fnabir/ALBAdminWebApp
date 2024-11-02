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
    const [phone, setPhone] = useState('');

    let previousValue: string[] = []

    useEffect(() => {
        if (user) {
            get(child(ref(database), `info/user/${user.uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setName(snapshot.val().name);
                    setPhone(snapshot.val().phone);
                    previousValue.push(name, phone);
                }
            }).catch((error) => {
                console.error(error.message);
                errorMessage(error.message)
            }).finally(() => {
                setDataLoading(false);
            });
        }
    }, [user]);

    const handleSubmit = async () => {
        if (name == previousValue[0] && phone == previousValue[1]) {
            successMessage("No data has been changed.")
        } else {
            update(ref(database, `info/user/${user.uid}`), {
                name: name,
                phone: phone,
            }).then(() => {
                successMessage("Data saved successfully!");
            }).catch((error) => {
                errorMessage(error.message);
            })
            if(user.displayName != name) {
                UpdateUserDisplayName(name);
                await logout();
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
            
            <div className="w-full max-w-lg mx-auto mt-5 items-center">

                <Input
                    id="full-name"
                    label="Full Name"
                    type="text"
                    className="my-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    message={"Change in display name requires you to login again"}
                />

                <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    className="my-3"
                    value={user.email}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />

                <Input
                    id="phone"
                    label="Phone Number"
                    type="number"
                    className="my-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    message="*Required"
                    minLength={0}
                    maxLength={11}
                />

                <div className="w-full flex space-x-2">
                    <Button 
                        type = "submit"
                        label="Save"
                        onClick={handleSubmit}/>
                </div>
            </div>
        </Layout>
        );
    }
}
