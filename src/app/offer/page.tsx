"use client"

import CardIcon from "@/components/card/CardIcon";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import {MdAddCircle, MdDownloading, MdError} from "react-icons/md";
import {GenerateDatabaseKey, GetDatabaseReference} from "@/firebase/database";
import CardOffer from "@/components/card/CardOffer";
import {useList} from "react-firebase-hooks/database";
import {Button, Modal} from "flowbite-react";
import {useState} from "react";
import CustomInput from "@/components/generic/CustomInput";
import {errorMessage, successMessage} from "@/utils/functions";
import CustomDropDown from "@/components/generic/CustomDropDown";
import {useAuth} from "@/context/AuthContext";
import {update} from "firebase/database";
import {OfferProductOptions, OfferWorkOptions} from "@/utils/arrays";
import UniqueChildren from "@/components/UniqueChildrenWrapper";
import {format} from "date-fns";

export default function Offer() {
  const router = useRouter();
  const {user, loading} = useAuth();
  const [ data, dataLoading, dataError ] = useList(GetDatabaseReference('-offer'));

  const [newOfferModal, setNewOfferModal] = useState<boolean>(false);
  const [offerData, setOfferData] = useState<OfferInterface>({
    id: "", name: "", product: "", work:""
  });

  const handleClick = () => {
    setOfferData({name: '', product: '', work: '', refer: user.username, uid: user.uid, date: format(new Date(), "dd MMM yyyy")});
    setNewOfferModal(true);
  }

  const saveNewOffer = () => {
    if (offerData?.name == "") {
      errorMessage("Project Name required")
    } else if (offerData?.product == "" || offerData?.product == "Select") {
      errorMessage("Select product type")
    } else if (offerData?.work == "" || offerData?.work == "Select") {
      errorMessage("Select work type")
    } else {
      update(GetDatabaseReference(`-offer/${format(new Date(), "yyMMdd")}${GenerateDatabaseKey(`-offer`)}`), offerData)
        .then(() => {
          successMessage("Saved the changes.")
        })
        .catch((error) => {
          console.error(error.message);
          errorMessage(error.message);
        }).finally(() => {
          setNewOfferModal(false);
        })
    }
  }

  if (loading) return <Loading/>

  if (!loading && !user) return router.push("/login")

  return (
    <Layout
      pageTitle="Offer | Asian Lift Bangladesh"
      headerTitle="Offer">
      <div>
        <div className="flex items-center mt-2 gap-x-2">
          <Button color={"blue"} onClick={handleClick}>
            <MdAddCircle className="mr-2 h-5 w-5"/>Add New Offer
          </Button>
        </div>

        <Modal show={newOfferModal} size="md" popup onClose={() => setNewOfferModal(false)} className="bg-black bg-opacity-50">
          <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
            <div className="text-xl font-medium text-white">New Offer</div>
          </Modal.Header>
          <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
            <div>
              <CustomInput id={"name"} type="text" label="Project Name"
                           onChange={(e) => setOfferData({...offerData, name: e.target.value})}
                           required={true}
              />
              <CustomInput id={"address"} type="text" label="Address"
                           onChange={(e) => setOfferData({...offerData, address: e.target.value})}
              />
              <CustomDropDown id="product" label={"Product Type"} options={OfferProductOptions}
                              onChange={(value) => setOfferData({...offerData, product: value})}
                              required={true}
              />
              <CustomDropDown id="work" label={"Work Type"} options={OfferWorkOptions}
                              onChange={(value) => setOfferData({...offerData, work: value})}
                              required={true}
              />
              <div className={`flex space-x-1`}>
                <CustomInput className={`flex-[1_1_50%]`} id={"person"} type="text" label="Person/Load"
                             onChange={(e) => setOfferData({...offerData, person: e.target.value})}
                />
                <CustomInput className={`flex-[1_1_50%]`} id={"floor"} type="text" label="Floor/Stop"
                             onChange={(e) => setOfferData({...offerData, floor: e.target.value})}
                />
              </div>
              <div className={`flex space-x-1`}>
                <CustomInput className={`flex-[1_1_30%]`} id={"unit"} type="number" label="Unit" minNumber={1} maxNumber={99}
                             onChange={(e) => setOfferData({...offerData, unit: e.target.value})}
                />
                <CustomInput className={`flex-[1_1_70%]`} id={"shaft"} type="text" label={"Shaft Size (W x D x H)"}
                             onChange={(e) => setOfferData({...offerData, shaft: e.target.value})}
                />
              </div>
              <CustomInput id={"note"} type="text" label="Remarks"
                           onChange={(e) => setOfferData({...offerData, note: e.target.value})}
              />
              <div className="flex mt-4 gap-4 justify-center">
                <Button color="blue" onClick={saveNewOffer}>Save</Button>
                <Button color="gray" onClick={() => setNewOfferModal(false)}>Cancel</Button>
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
            ) : dataError || !data ? (
              <CardIcon title={"Error"} subtitle={dataError?.message}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : data.length == 0 ? (
              <CardIcon title={"No offer Found!"}>
                <MdError className='mx-1 w-6 h-6 content-center'/>
              </CardIcon>
            ) : (
              <UniqueChildren>
                {
                  data.map((item) => {
                    const snapshot = item.val();
                    return (
                      <div className="flex flex-col" key={item.key}>
                        <CardOffer id={item.key!} name={snapshot.name} address={snapshot.address}
                                   product={snapshot.product} work={snapshot.work} unit={snapshot.unit}
                                   floor={snapshot.floor} person={snapshot.person} shaft={snapshot.shaft}
                                   date={snapshot.date} note={snapshot.note} refer={snapshot.refer}/>
                      </div>
                    )
                  })
                }
                </UniqueChildren>
            )
          }
        </div>
      </div>
    </Layout>
  );
}
