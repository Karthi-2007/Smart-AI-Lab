import React from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";



const ReportChart = ({ type="booking" }) => {



const bookingData = [

  {
    month:"Jan",
    bookings:45
  },

  {
    month:"Feb",
    bookings:65
  },

  {
    month:"Mar",
    bookings:80
  },

  {
    month:"Apr",
    bookings:55
  },

  {
    month:"May",
    bookings:95
  },

  {
    month:"Jun",
    bookings:75
  }

];





const equipmentData = [

  {
    name:"Computers",
    usage:85
  },

  {
    name:"Robotics",
    usage:70
  },

  {
    name:"IoT Kits",
    usage:60
  },

  {
    name:"Servers",
    usage:90
  },

];







const faultData=[

  {
    month:"Jan",
    faults:8
  },

  {
    month:"Feb",
    faults:12
  },

  {
    month:"Mar",
    faults:5
  },

  {
    month:"Apr",
    faults:15
  },

  {
    month:"May",
    faults:7
  }

];





return (


<div

className="
bg-white
rounded-2xl
shadow-md
border
p-6
w-full
"

>



{/* Header */}

<div
className="
mb-5
"
>


<h2

className="
text-xl
font-bold
text-gray-800
"

>

Analytics Overview

</h2>



<p

className="
text-sm
text-gray-500
"

>

AI based laboratory insights

</p>


</div>







<div
className="
h-80
"
>


<ResponsiveContainer
width="100%"
height="100%"
>



{

type==="booking" &&

<LineChart data={bookingData}>


<CartesianGrid 
strokeDasharray="3 3"
/>


<XAxis 
dataKey="month"
/>


<YAxis />


<Tooltip />


<Legend />



<Line

type="monotone"

dataKey="bookings"

strokeWidth={3}

/>


</LineChart>


}








{

type==="equipment" &&


<BarChart data={equipmentData}>


<CartesianGrid 
strokeDasharray="3 3"
/>


<XAxis

dataKey="name"

/>


<YAxis />


<Tooltip />


<Legend />



<Bar

dataKey="usage"

barSize={35}

/>



</BarChart>


}









{

type==="fault" &&


<LineChart data={faultData}>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis

dataKey="month"

/>


<YAxis />


<Tooltip />


<Legend />



<Line

type="monotone"

dataKey="faults"

strokeWidth={3}

/>


</LineChart>


}




</ResponsiveContainer>


</div>



</div>


);


};



export default ReportChart;