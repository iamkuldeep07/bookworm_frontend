import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const { settingPopup } = useSelector((state) => state.popup);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState((books && books.length) || 0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    let numberOfUsers = users.filter((user) => user.role === "User");
    let numberOfAdmins = users.filter((user) => user.role === "Admin");
    setTotalUsers(numberOfUsers.length);
    setTotalAdmin(numberOfAdmins.length);

    let numberOfTotalBorrowedBooks = allBorrowedBooks.filter(
      (book) => book.returnDate === null
    );
    let numberOfTotalReturnedBooks = allBorrowedBooks.filter(
      (book) => book.returnDate !== null
    );
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
  }, [users, allBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
   <main className="relative flex-1 pt-28 px-4 lg:px-6 xl:px-8">
  <Header />

  <div className="flex flex-col xl:flex-row gap-10">
    {/* LEFT SIDE */}
    <div className="flex-[2] flex flex-col gap-7 justify-between py-5">
      {/* Pie Chart */}
      <div className="flex justify-center xl:justify-start w-full">
        <Pie
          data={data}
          options={{ cutout: 0 }}
          className="w-full max-w-[400px] h-auto"
        />
      </div>

      {/* Stats Details */}
      <div className="flex items-center p-6 w-full bg-white rounded-lg gap-5">
        <img
          src={logo}
          alt="logo"
          className="w-auto h-24 object-contain rounded-lg"
        />
        <span className="w-[2px] bg-black h-full"></span>
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#3D3E3E]"></span>
            <span>Total Borrowed Books</span>
          </p>
          <p className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
            <span>Total Returned Books</span>
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex-[3] flex flex-col gap-10">
      {/* Stats in Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
        {[ 
          { icon: usersIcon, count: totalUsers, label: "Total User Base" },
          { icon: bookIcon, count: totalBooks, label: "Total Book Count" },
          { icon: adminIcon, count: totalAdmin, label: "Total Admin Count" }
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-3 bg-white p-5 rounded-lg hover:shadow-md transition"
          >
            <div className="bg-gray-300 h-20 w-20 flex justify-center items-center rounded-lg">
              <img src={item.icon} alt="icon" className="w-8 h-8" />
            </div>
            <h4 className="font-black text-3xl">{item.count}</h4>
            <p className="font-light text-gray-700 text-sm text-center">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="bg-white p-5 rounded-lg shadow flex flex-col items-center gap-4 w-full max-w-[500px] mx-auto">
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt="avatar"
            className="rounded-full w-32 h-32 object-cover border-4 border-gray-200"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex justify-center items-center text-4xl text-white font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}
        <h2 className="text-xl 2xl:text-2xl font-semibold text-center">
          {user?.name || "Unknown User"}
        </h2>
        <p className="text-gray-600 text-sm 2xl:text-base text-center">
          Welcome to your admin dashboard. Here you can manage all the settings
          and monitor the statistics.
        </p>
      </div>

      {/* Quote Section */}
      <div className="hidden xl:flex bg-white p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative justify-center items-center rounded-2xl">
        <h4 className="overflow-hidden text-center">
          "Embarking on the journey of reading fosters personal growth,
          nurturing a path towards excellence and the refinement of character."
        </h4>
        <p className="text-gray-700 text-sm sm:text-lg absolute right-10 bottom-3 px-6 ">
          ~ BookWorm Team
        </p>
      </div>
    </div>
  </div>
</main>
    </>
  );
};

export default AdminDashboard;
