"use client"

import CardIcon from "@/components/card/CardIcon";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { MdAddCircle, MdDownloading, MdError } from "react-icons/md";
import CardCallbackTotal from "@/components/card/CardCallbackTotal";
import AccessDenied from "@/components/AccessDenied";
import {useList, useListKeys} from "react-firebase-hooks/database";
import {GenerateDatabaseKey, GetDatabaseReference} from "@/firebase/database";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import CustomInput from "@/components/generic/CustomInput";
import CustomDropDown from "@/components/generic/CustomDropDown";
import { format, parse } from "date-fns";
import CustomDateTimeInput from "@/components/generic/CustomDateTimeInput";
import { CallbackStatusOptions } from "@/utils/arrays";
import { errorMessage, successMessage } from "@/utils/functions";
import { update } from "firebase/database";
import UniqueChildren from "@/components/UniqueChildrenWrapper";

export default function Callback() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [ data, dataLoading, dataError ] = useList(GetDatabaseReference('callback'));

  const [newModal, setNewModal] = useState(false);
  const projectNames = useListKeys(GetDatabaseReference(`balance/project`))[0];
  const projectNameOptions = projectNames?.map((projectName) => ({ value: projectName}))
  const [callbackData, setCallbackData] = useState({
    project: '',
    name: '',
    details: '',
    date: '',
    status: '',
    databaseDate: ''
  });

  const handleAddNewCallbackClick = () => {
    setCallbackData({project: '', name:'', details:'', date: format(new Date(), "dd.MM.yy"), status:'', databaseDate: format(new Date(), "yyyy-MM-dd")})
    setNewModal(true)
  }

  const saveCallback = () => {
    if (!callbackData || !callbackData.project || callbackData.project == 'Select') errorMessage('Project Name required')
    else if (!callbackData.details) errorMessage('Callback details required')
    else {
      const key = callbackData.databaseDate + GenerateDatabaseKey((`callback/${callbackData.project}`))
      update(GetDatabaseReference(`callback/${callbackData.project}/${key}`), {
        details: callbackData.details,
        name: callbackData.name,
        status: callbackData.status,
        date: callbackData.date
      }).then(() => {
        successMessage("Saved the callback successfully")
      }).catch((error) => {
        errorMessage(error.message)
      }).finally(() => {
        setNewModal(false)
      })
    }
  }

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login")

  if (user.role == "admin" || user.role == "manager") {
    return (
      <Layout
        pageTitle="Callback | Asian Lift Bangladesh"
        headerTitle="Callback">
        <div>
          <div className="flex items-center mt-2 gap-x-2">
            <Button color={"blue"} onClick={handleAddNewCallbackClick}>
              <MdAddCircle className="mr-2 h-5 w-5"/>Add New Callback
            </Button>
          </div>

          <Modal show={newModal} size="md" popup onClose={() => setNewModal(false)} className="bg-black bg-opacity-50">
            <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
              <div className="text-xl font-medium text-white">New Offer</div>
            </Modal.Header>
            <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
              <div>
                <CustomDropDown id="project" label={"Project Name"} options={projectNameOptions!}
                                onChange={(value) => setCallbackData({...callbackData, project: value})}
                                required={true}
                />
                <CustomInput id={"details"} type="text" label="Callback Details"
                             onChange={(e) => setCallbackData({...callbackData, details: e.target.value})}
                             required={true}
                />
                <CustomInput id={"name"} type="text" label="Name"
                             onChange={(e) => setCallbackData({...callbackData, name: e.target.value})}
                />
                <CustomDropDown id="status" label={"Status"} options={CallbackStatusOptions}
                                onChange={(value) => setCallbackData({...callbackData, status: value})}
                />
                <CustomDateTimeInput id={"startDate"} label={"Start"} type={"date"}
                                     value={format(new Date(), "yyyy-MM-dd")}
                                     onChange={(value) => setCallbackData({ ...callbackData, date: format(parse(value, "yyyy-MM-dd", new Date()), "dd.MM.yy"), databaseDate: value})}
                                     required={true}
                />
                <div className="flex mt-4 gap-4 justify-center">
                  <Button color="blue" onClick={saveCallback}>Save</Button>
                  <Button color="gray" onClick={() => setNewModal(false)}>Cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          <div className="flex flex-col py-2 gap-y-2">
            {
              dataLoading ? (
                <CardIcon title={"Loading"} subtitle={"If data doesn't load in 30 seconds, please refresh the page."}>
                  <MdDownloading className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : dataError ? (
                <CardIcon title={"Error"} subtitle={dataError.message}>
                  <MdError className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : !data || data.length == 0 ? (
                <CardIcon title={"No record found!"}>
                  <MdError className='mx-1 w-6 h-6 content-center'/>
                </CardIcon>
              ) : (
                <UniqueChildren>
                  {
                    data.map((item) => (
                      <div className="flex flex-col" key={item.key}>
                        <CardCallbackTotal name={item.key!} value={item.size} id={item.key!}/>
                      </div>
                    ))
                  }
                </UniqueChildren>
              )
            }
          </div>
        </div>
      </Layout>
    );
  } else return <AccessDenied/>;
}