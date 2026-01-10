import { useParams } from "react";
import { useRef, useState } from "react";
import carData from "../../Cars.json";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CarsDetails() {
  const { id } = useParams();
  const car = carData.find((c) => c.id === id);
  const [openIndex, setOpenindex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccesModal] = useState(false);
  const toggleAccordion = (index) => {
    setOpenindex(openIndex === index ? null : index);
  };
  const rentalCondition = [
    {
      title: "Contract and Annxes",
      description:
        "In addition to the car rental conatract to be signed at the time. you must have ID, a driver's license, and a deposit.",
    },
    {
      title: "Payments",
      description:
        "The total rental fee is collected at the time of rental. Any additional costs will be added up based on the distance traveled.",
    },
    {
      title: "Delivery",
      description:
        "Delivery is free if you are within the same area. If you are in a different city, the shipping fee will be calculated based on the delivery person's travel expenses.",
    },
    {
      title: "Tracffic Fines",
      description:
        "Traffic fines are the responsibility of the customer. If fined, customers should notify us of the date of the fine and send the fine receipt to our company.",
    },
  ];
  if (!car)
    return <div className="text-white text-center mt-20">Car Not Found</div>;
  const [pickupDate, setPickupDate] = useState(null);
  const datePickerRef = useRef(null);

  const openCalenar = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };
  const [returnDate, setReturnDate] = useState(null);
  const returnPickerRef = useRef(null);

  const openreturnCalendar = () => {
    if (returnPickerRef.current) {
      returnPickerRef.current.setFocus();
    }
  };
  return (
    <>
      <div className="bg-[#121212] text-white font-sans">
        <div
          className="relative h-[70vh] bg-cover bg-center flex items-end px-[12%] py-20 "
          style={{ backgroundImage: `url:(${car.image})` }}
        >
          <div className="absolute inset-0 cars-det-section"></div>
          <div className="relative z-10">
            <h6 className="uppercase text-1xl font-bold tracking-widest text-[#f5b754]">
              Luxury Cars
            </h6>
            <h1 className="text-4xl font-bold font-bricolage">{car.name}</h1>
          </div>
        </div>
      </div>
      {/* contact */}
      <div className="flex flex-col lg:flex-row gap-10 px-[12%] py-14"></div>
    </>
  );
}
export default CarsDetails;
