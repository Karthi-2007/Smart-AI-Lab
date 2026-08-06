import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  UserCircle
} from "lucide-react";


const FacultyNavbar = () => {

  const [openProfile, setOpenProfile] = useState(false);


  return (

    <header
      className="
      fixed top-0 right-0 left-64
      h-20 bg-white shadow-md
      flex items-center justify-between
      px-8 z-50
      "
    >


      {/* Search Section */}

      <div className="flex items-center 
      bg-gray-100 rounded-xl px-4 py-2 
      w-96">

        <Search 
          size={20}
          className="text-gray-500"
        />

        <input

          type="text"

          placeholder="Search equipment, bookings..."

          className="
          bg-transparent outline-none
          ml-3 w-full
          text-sm
          "

        />


      </div>




      {/* Right Section */}

      <div className="flex items-center gap-6">


        {/* Notification */}

        <button
          className="
          relative
          hover:bg-orange-50
          p-3 rounded-full
          transition
          "
        >

          <Bell 
            size={22}
            className="text-gray-700"
          />


          <span
            className="
            absolute top-1 right-1
            bg-red-500 text-white
            text-xs
            w-5 h-5
            flex items-center justify-center
            rounded-full
            "
          >
            3
          </span>


        </button>




        {/* Profile */}

        <div className="relative">


          <button

            onClick={()=>setOpenProfile(!openProfile)}

            className="
            flex items-center gap-3
            hover:bg-gray-100
            px-3 py-2
            rounded-xl
            "

          >


            <div
              className="
              bg-orange-100
              p-2 rounded-full
              "
            >

              <UserCircle
                size={35}
                className="text-orange-600"
              />

            </div>



            <div className="text-left">

              <h3
                className="
                font-semibold
                text-gray-800
                "
              >
                Dr. Arun Kumar
              </h3>


              <p
                className="
                text-xs
                text-gray-500
                "
              >
                Faculty
              </p>


            </div>



            <ChevronDown
              size={18}
              className="text-gray-500"
            />


          </button>





          {/* Dropdown */}

          {
            openProfile &&

            <div
              className="
              absolute right-0 mt-3
              bg-white
              w-52
              rounded-xl
              shadow-lg
              border
              p-3
              "
            >


              <button

                className="
                flex items-center gap-3
                w-full
                px-3 py-2
                rounded-lg
                hover:bg-orange-50
                text-gray-700
                "

              >

                <UserCircle size={18}/>

                My Profile


              </button>





              <button

                className="
                flex items-center gap-3
                w-full
                px-3 py-2
                rounded-lg
                hover:bg-red-50
                text-red-600
                "

              >

                <LogOut size={18}/>

                Logout


              </button>


            </div>


          }


        </div>


      </div>



    </header>


  );

};


export default FacultyNavbar;