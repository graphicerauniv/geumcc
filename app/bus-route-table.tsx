import React from "react";

const busRoutes = [
    {
        srNo: 1,
        startingFrom:
            "Vikas Nagar- Haridatpur Chowk- Langia Road- Shapur- Selaqui- Sudhhowala-Nanda Ki Chowki- Premnagar- Panditwari- Vasant Vihar- Balliwala Chowk-GMS Road-Geu",
        pickUpTime: "7:00 AM",
        busNo: "47",
        driver: "Rohit Singh 9758277447",
    },
    {
        srNo: 2,
        startingFrom:
            "Kulhal-Naya Gaon Palio- Badowala-Telpur-Mehuwala-ISBT-Geu",
        pickUpTime: "7:00 AM",
        busNo: "3",
        driver: "Manjeet Singh 8006136454",
    },
    {
        srNo: 3,
        startingFrom:
            "Bhaunwala Chowk-Manduwala-Sudhowala-Nanda Ki Chowki- Premnagar-Panditwari-Vasant Vihar-Balliwala Chowk-GMS Road-Geu",
        pickUpTime: "7:00 AM",
        busNo: "101",
        driver: "Kuldeep Negi 7579151412",
    },
    {
        srNo: 4,
        startingFrom:
            "Hathibadala-Garhi Cant-Vijay Coloneg-Chir Bagh-CM House-Garhi Cant-ONGC Chowk-Ballupur Chowk-GMS-Geu",
        pickUpTime: "7:30 AM",
        busNo: "84",
        driver: "Gopi Thapa 7452844411",
    },
    {
        srNo: 5,
        startingFrom:
            "Rajender Nagar-Yamuna Coloney-Bindal Pul-Kishan Nagar-Blood Bank-Ballupur Chowk-GMS Road-Geu",
        pickUpTime: "7:30 AM",
        busNo: "93",
        driver: "Lakhan Bhuiaya 8279311590",
    },
    {
        srNo: 8,
        startingFrom:
            "Raipur-Great Value-Dilaram Bazar-Survey Chowk-Dwarka Store-Araghar-Rispana-Kargi Chowk-ISBT-Geu",
        pickUpTime: "7:00 AM",
        busNo: "96",
        driver: "Amit Chhetri 7895572900",
    },
    {
        srNo: 9,
        startingFrom:
            "IT Park-Nala Paani Chowk-Shastradhara Crossing-Ladpur-6 No. Pulia-Fountain Chowk Rispana-Kargi Chowk-ISBT-Geu",
        pickUpTime: "7:15 AM",
        busNo: "54",
        driver: "Mukesh Kumar 9997243900",
    },
    {
        srNo: 10,
        startingFrom:
            "Raipur Chowk-Dobhal Chowk-6 No. Pulia-Ring Road-Post Office Nehru Gram-Jogiwala-Rispana-ISBT-Geu/Garhi",
        pickUpTime: "7:00 AM",
        busNo: "61",
        driver: "Sudhir 8791978964",
    },
    {
        srNo: 11,
        startingFrom:
            "Daudwala-Mathurawala-Vishnupuram-Bangali Kothi-Kargi Chowk-ISBT-Geu",
        pickUpTime: "7:30 AM",
        busNo: "7",
        driver: "Govind Singh 9897983344",
    },
    {
        srNo: 12,
        startingFrom: "Clock Tower-Prince Chowk-Saharanpur Chowk-Geu",
        pickUpTime: "7:50 AM",
        busNo: "18",
        driver: "Sunil Kumar 7060226294",
    },
];

export default function BusRouteTable() {
    return (
        <div
            id="bus-route-table"
            className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 py-10 px-4"
        >
            <div className="w-full max-w-7xl mx-auto rounded-xl shadow-2xl p-6 border border-white/30">
                <h2 className="text-3xl md:text-4xl font-bold font-serif mb-8 text-center text-white">
                    BUS ROUTE PLAN FOR SUNDAY
                </h2>
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full backdrop-blur-sm bg-white/10 rounded-lg shadow-xl border border-white/20">
                        <thead className="bg-white/30 text-white">
                            <tr>
                                <th className="py-4 px-3 md:px-4 text-left font-medium text-sm md:text-base">
                                    SR. NO
                                </th>
                                <th className="py-4 px-3 md:px-4 text-left font-medium text-sm md:text-base">
                                    STARTING FROM
                                </th>
                                <th className="py-4 px-3 md:px-4 text-left font-medium whitespace-nowrap text-sm md:text-base">
                                    PICK UP TIME
                                </th>
                                <th className="py-4 px-3 md:px-4 text-left font-medium text-sm md:text-base">
                                    BUS NO
                                </th>
                                <th className="py-4 px-3 md:px-4 text-left font-medium text-sm md:text-base">
                                    DRIVER
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {busRoutes.map((route) => (
                                <tr
                                    key={route.srNo}
                                    className="hover:bg-white/20 transition-colors"
                                >
                                    <td className="py-4 px-3 md:px-4 font-medium text-white text-sm md:text-base">
                                        {route.srNo}
                                    </td>
                                    <td className="py-4 px-3 min-w-[400px] md:px-4 text-white/90 text-sm md:text-base">
                                        {route.startingFrom}
                                    </td>
                                    <td className="py-4 px-3 md:px-4 whitespace-nowrap text-white/90 text-sm md:text-base">
                                        {route.pickUpTime}
                                    </td>
                                    <td className="py-4 px-3 md:px-4 text-white/90 text-sm md:text-base">
                                        {route.busNo}
                                    </td>
                                    <td className="py-4 px-3 md:px-4 text-white/90 text-sm md:text-base">
                                        {route.driver}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
