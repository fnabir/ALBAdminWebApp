"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { database } from "@/firebase/config";
import { child, get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import Input from "@/components/generic/Input";
import Button from "@/components/generic/Button";
import {GetObjectData, UpdateUserDisplayName} from "@/firebase/database";
import { logout } from "@/firebase/auth";

export default function UpdateProfile() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [dataLoading, setDataLoading] = useState(true)
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (dataLoading && user) {
            const { data } = GetObjectData(`info/user/${user.uid}`);
            if (data) {
                setPhone(userData.phone);
                setName(userData.name);
            }
            setDataLoading(false);
        }
    }, [dataLoading, user]);

    const handleSubmit = async () => {
        if(user.displayName != name) {
            UpdateUserDisplayName(name);
            await logout();
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
                    message="*Required"
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
                    />

                <div className="w-full flex space-x-2">
                    <Button 
                        type = "submit"
                        label="Save"
                        onClick={handleSubmit}/>
                </div>

                <p className="text-red-400 text-sm text-center mt-2">Changes may require you to login again</p>
            </div>
        </Layout>
        );
    }
}
