import api from "../api";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from "../components/RequestForm";
import { RiAddLine } from 'react-icons/ri';
import { renderEventContent, handleEventChange } from "../components/CalendarFunction"


function Home() {
  const [absentRequest, setAbsentRequest] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    getRequest();
  }, []);

  const getRequest = async () => {
    try {
      const response = await api.get("/api/absent-request/");
      const data = response.data;
      const transformedData = data.map((request) => ({
        id : request.id,
        title: request.reason,
        start: request.start_shift, 
        end: request.end_shift, 
        extendedProps: { 
          category: request.category,
          created_date: request.created_date,
          date_request: request.date_request, 
          end_shift: request.end_shift,
          reason: request.reason,
          remarks: request.remarks,
          start_shift: request.start_shift
        }
      }));
      setAbsentRequest(transformedData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateRequest = (newRequest) => {
    const transformedRequest = {
      title: newRequest.reason,
      start: newRequest.start_shift,
      end: newRequest.end_shift,
      extendedProps: {
        id: newRequest.id,
        category: newRequest.category,
        date_request: newRequest.date_request,
        end_shift: newRequest.end_shift,
        reason: newRequest.reason,
        remarks: newRequest.remarks,
        start_shift: newRequest.start_shift
      }
    };
    setAbsentRequest((prevRequests) => [...prevRequests, transformedRequest]);
  };


  // const api_test = async () => {
  //   try {
  //     const response = await api.get('/api/test-api/');
      
  //     console.log(response.data.data)
  //   } catch (error) {
  //     console.error('Error fetching data:', error.message);
  //   }
  // };

  // api_test()

  return (
    <div className="p-4">
    <button
      className="absolute right-12 bottom-5 z-10 bg-orange-500 hover:bg-orange-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline flex items-center justify-center w-16 h-16 transition-transform duration-300 transform rotate-0 hover:rotate-90"
      onClick={() => setIsModalOpen(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RiAddLine className="text-lg" />
    </button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={absentRequest} 
        height='85vh'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listMonth'
        }}
        editable={true}
        eventChange={handleEventChange}
        eventContent={renderEventContent}

      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateRequest={handleCreateRequest}
      />
    </div>
  );
}

export default Home;
