"use client"

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { database } from "@/firebase/config";
import { child, get, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function UpdateProfile() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [dataLoading, setDataLoading] = useState(true)
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (dataLoading && user) {
            get(child(ref(database), 'info/user/'+user.uid+'/phone')).then((snapshot) => {
                if (snapshot.exists()) {
                    setPhone(snapshot.val());
                } else {
                    setPhone("Not available");
                }
            }).catch((error) => {
                console.error(error);
            });
            setDataLoading(false)
        }
    });

    while (loading) return <Loading/>
    if (!loading && !user) return router.push("login")
    else {
        return (
        <Layout 
            pageTitle="User | Asian Lift Bangladesh"
            headerTitle="Update Profile">
            <div className="flex flex-col py-2 gap-y-2 justify-center w-full items-center">
                <div className="flex w-[50%] items-center">
                    <div className="w-[33%]">Full Name</div>
                    <span className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                        {user.username}
                    </span>
                </div>
                <div className="flex w-[50%] items-center">
                    <div className="w-[33%]">Email address</div>
                    <span className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                        {user.email}
                    </span>
                </div>
                <div className="flex w-[50%] items-center">
                    <div className="w-[33%]">Phone Number</div>
                    <span className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                        {phone}
                    </span>
                </div>
            </div>
        </Layout>
        );
    }
}
