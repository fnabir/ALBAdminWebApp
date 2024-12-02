import {MdDelete, MdEditNote} from "react-icons/md";
import {useState} from "react";
import {Button, Modal} from "flowbite-react";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {remove, update} from "firebase/database";
import {GetDatabaseReference} from "@/firebase/database";
import {errorMessage, successMessage} from "@/utils/functions";
import CustomInput from "@/components/generic/CustomInput";
import CustomDropDown from "@/components/generic/CustomDropDown";
import {OfferProductOptions, OfferWorkOptions} from "@/utils/arrays";

export default function CardOffer(props:OfferInterface) {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const line1 = props.address ?  `${props.name} - ${props.address}` : `${props.name}`;
  const line2 = props.work + " - " + (props.product ? props.product + (props.unit ? `(${props.unit})` : "") : "");
  const line3 = (props.floor ? `Floor/Stop: ${props.floor} | ` : "") + (props.person ? `Person/Load: ${props.person} | ` : "") + (props.shaft ? `Shaft Dimension: ${props.shaft} ` : "");
  const line4 = (props.note ? `${props.note} | ` : "") + (props.refer ? `${props.refer}` : "");

  const databaseRef = `-offer/${props.id}`;
  const [offerData, setOfferData] = useState<OfferInterface>({
    name: props.name,
    address: props.address ? props.address : '' ,
    product: props.product,
    work: props.work,
    person: props.person ? props.person : '',
    unit: props.unit? props.unit : '',
    floor: props.floor ? props.floor : '',
    shaft: props.shaft ? props.shaft : '',
    note: props.note ? props.note : ''
  });

  const updateOffer = () => {
    if (!offerData || offerData.name) errorMessage("Project Name required");
    else if (!offerData.product) errorMessage("Product type required");
    else if (!offerData.work) errorMessage("Work type required");
    else {
      update(GetDatabaseReference(databaseRef), offerData).then(() => {
        successMessage("Successfully updated offer.");
      }).catch((e) => {
        console.error(e);
        errorMessage(e.response.data);
      }).finally(() => {
        setEditModal(false);
      })
    }
  }

  const deleteOffer = () => {
    remove(GetDatabaseReference(databaseRef)).then(() => {
      successMessage("Deleted successfully.")
    }).catch ((error) => {
      errorMessage(error.message);
    }).finally(() => {
      setDeleteModal(false);
    })
  }

  return (
    <div className={"rounded-lg shadow hidden md:block sm:text-center md:text-start bg-slate-700 hover:bg-opacity-80"}>
      <div className="w-full mx-auto px-6 pt-1 md:flex md:items-center md:justify-between text-white">
        <div className="flex-wrap w-28">
          {props.date}
        </div>
        <div className="flex-auto">
          <div className="font-semibold">{line1}</div>
          <div>{line2}</div>
          <div>{line3}</div>
          <div>{line4}</div>
        </div>
        <button
          className={"mx-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 hidden md:block "}
          onClick={() => setEditModal(true)}>
          <MdEditNote className='w-6 h-6'/>
        </button>

        <Modal show={editModal} size="md" popup onClose={() => setEditModal(false)} className="bg-black bg-opacity-50">
          <Modal.Header className="bg-slate-800 rounded-t-md text-white border-t border-x border-blue-500">
            <div className="text-xl font-medium text-white">New Offer</div>
          </Modal.Header>
          <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
            <div>
              <CustomInput id={"name"} type="text" label="Project Name"
                           value={offerData.name}
                           onChange={(e) => setOfferData({...offerData, name: e.target.value})}
                           required={true}
              />
              <CustomInput id={"address"} type="text" label="Address"
                           value={offerData.address}
                           onChange={(e) => setOfferData({...offerData, address: e.target.value})}
              />
              <CustomDropDown id="product" label={"Product Type"} options={OfferProductOptions}
                              value={offerData.product}
                              onChange={(value) => setOfferData({...offerData, product: value})}
                              required={true}
              />
              <CustomDropDown id="work" label={"Work Type"} options={OfferWorkOptions}
                              value={offerData.work}
                              onChange={(value) => setOfferData({...offerData, work: value})}
                              required={true}
              />
              <div className={`flex space-x-1`}>
                <CustomInput className={`flex-[1_1_50%]`} id={"person"} type="text" label="Person/Load"
                             value={offerData.person}
                             onChange={(e) => setOfferData({...offerData, person: e.target.value})}
                />
                <CustomInput className={`flex-[1_1_50%]`} id={"floor"} type="text" label="Floor/Stop"
                             value={offerData.floor}
                             onChange={(e) => setOfferData({...offerData, floor: e.target.value})}
                />
              </div>
              <div className={`flex space-x-1`}>
                <CustomInput className={`flex-[1_1_30%]`} id={"unit"} type="number" label="Unit" minNumber={1} maxNumber={99}
                             value={offerData.unit}
                             onChange={(e) => setOfferData({...offerData, unit: e.target.value})}
                />
                <CustomInput className={`flex-[1_1_70%]`} id={"shaft"} type="text" label={"Shaft Size (W x D x H)"}
                             value={offerData.shaft}
                             onChange={(e) => setOfferData({...offerData, shaft: e.target.value})}
                />
              </div>
              <CustomInput id={"note"} type="text" label="Remarks"
                           value={offerData.note}
                           onChange={(e) => setOfferData({...offerData, note: e.target.value})}
              />
              <div className="flex mt-4 gap-4 justify-center">
                <Button color="blue" onClick={updateOffer}>Save</Button>
                <Button color="gray" onClick={() => setEditModal(false)}>Cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <button className={"mr-2 p-2 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 hidden md:block"}
                onClick={() => setDeleteModal(true)}>
          <MdDelete className='w-6 h-6'/>
        </button>

        <Modal show={deleteModal} size="md" onClose={() => setDeleteModal(false)} popup className="bg-black bg-opacity-50">
          <Modal.Header className="bg-red-800 rounded-t-md text-white border-t border-x border-blue-500">
            <div className="text-xl font-medium text-white">Delete Offer</div>
          </Modal.Header>
          <Modal.Body className="bg-slate-950 rounded-b-md border-b border-x border-blue-500">
            <div className="text-center space-y-5 m-4">
              <HiOutlineExclamationCircle className="mx-auto h-14 w-14 text-gray-200" />
              <div className="text-lg text-gray-300">
                Are you sure you want to delete this offer?
              </div>
              <div className="flex justify-center gap-4">
                <Button color={"failure"} onClick={deleteOffer}>Delete</Button>
                <Button color={"gray"} onClick={() => setDeleteModal(false)}>Cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

      </div>
    </div>
  )
}