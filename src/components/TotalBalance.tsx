import { formatCurrency } from "@/utils/functions";
import { MdUpdate } from "react-icons/md";
import React, {useState} from "react";

interface Props {
    value: number
    date: string
    text?: string
    update?: boolean
    onClick?: () => void;
}

const TotalBalance: React.FC<Props> = ({
                                         value,
                                         date,
                                         text,
                                         update = false,
                                         onClick
}) => {
	const titleText = text ? text : "Total Balance";
	const dateText = date == null || date == '' ? 'Last update date not found' : 'Last updated on ' + (date);
	const [updateState, setUpdateState] = useState(update);
	const handleOnClick = () => {
		if (onClick !== undefined) {
			onClick()
			setUpdateState(false);
		}
	};

    return (
      <div className="rounded-lg shadow bg-slate-800 flex pl-6 pr-2 pt-2">
          <div className={(updateState && update ? "" : "pr-2") + " w-full mx-auto md:flex md:items-center md:justify-between text-white"}>
              <div>
                  <div className="text-xl sm:text-center md:text-start">{titleText}</div>
                  <p id="updatedate" className="text-sm pb-2 sm:text-center md:text-start">{dateText}</p>
              </div>
              <div className="items-center text-right mt-3 text-3xl font-medium sm:mt-0">
                  {formatCurrency(value)}
              </div>
          </div>
          <button className={updateState && update ? "w-10 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70 m-2 p-2" : "hidden"}
                  onClick={handleOnClick}>
              <MdUpdate className='w-6 h-6'/>
          </button>
      </div>
    )
}

export default TotalBalance;