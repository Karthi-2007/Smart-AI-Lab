import React from "react";
import {
  Laptop,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";


const EquipmentStatus = ({ equipment }) => {


  const getStatusStyle = (status) => {

    switch(status){

      case "Available":
        return "bg-green-100 text-green-700";

      case "In Use":
        return "bg-blue-100 text-blue-700";

      case "Maintenance":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };



  const getRiskStyle = (risk)=>{

    switch(risk){

      case "Low":
        return "text-green-600";

      case "Medium":
        return "text-yellow-600";

      case "High":
        return "text-red-600";

      default:
        return "text-gray-600";

    }

  };




  return (

    <div
      className="
      bg-white
      rounded-2xl
      shadow-md
      border
      p-5
      hover:shadow-lg
      transition
      "
    >



      {/* Header */}

      <div
        className="
        flex justify-between
        items-center
        mb-5
        "
      >


        <div className="flex gap-3 items-center">


          <div
            className="
            bg-orange-100
            p-3
            rounded-xl
            "
          >

            <Laptop
              size={22}
              className="text-orange-600"
            />

          </div>



          <div>

            <h3
              className="
              font-bold
              text-gray-800
              "
            >
              {equipment.name}
            </h3>


            <p
              className="
              text-sm text-gray-500
              "
            >
              {equipment.category}
            </p>


          </div>


        </div>





        {/* Status */}

        <span
          className={`
          px-3 py-1
          rounded-full
          text-xs
          font-semibold

          ${getStatusStyle(equipment.status)}

          `}
        >

          {equipment.status}

        </span>



      </div>








      {/* Details */}


      <div className="
      space-y-4
      ">





        {/* Usage */}


        <div>


          <div
            className="
            flex justify-between
            text-sm mb-2
            "
          >

            <span className="text-gray-600">

              Usage

            </span>


            <span className="font-semibold">

              {equipment.usage}%

            </span>


          </div>



          <div
            className="
            w-full
            bg-gray-200
            rounded-full
            h-2
            "
          >

            <div

              className="
              bg-orange-500
              h-2
              rounded-full
              "

              style={{
                width:`${equipment.usage}%`
              }}

            />


          </div>



        </div>









        {/* AI Prediction */}


        <div
          className="
          flex items-center
          justify-between
          bg-gray-50
          p-3
          rounded-xl
          "
        >


          <div
            className="
            flex items-center gap-2
            "
          >

            <Activity
              size={18}
              className="text-orange-600"
            />


            <span className="text-sm">

              AI Risk

            </span>


          </div>




          <span
            className={`
            font-semibold text-sm

            ${getRiskStyle(equipment.risk)}

            `}
          >

            {equipment.risk}


          </span>



        </div>








        {/* Last Maintenance */}


        <div
          className="
          flex items-center gap-2
          text-sm
          text-gray-600
          "
        >


          {
            equipment.status === "Maintenance"
            ?

            <AlertTriangle
              size={18}
              className="text-red-500"
            />

            :

            <CheckCircle
              size={18}
              className="text-green-500"
            />

          }



          <span>

            Last Maintenance :
            {" "}
            {equipment.lastMaintenance}

          </span>



        </div>





      </div>



    </div>


  );

};



export default EquipmentStatus;