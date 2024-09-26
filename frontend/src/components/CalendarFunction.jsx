import api from "../api";

export const renderEventContent = (eventInfo) => {
  // Assuming eventInfo.event.extendedProps.start_shift is '2024-07-14 01:00:00+00'
  const startShiftString = eventInfo.event.extendedProps.start_shift;
  const endShiftString = eventInfo.event.extendedProps.end_shift;

  // Parse the date strings directly (assuming they are in ISO format)
  const startShift = new Date(startShiftString);
  const endShift = new Date(endShiftString);

  // Format the dates in UTC to ensure consistency with backend
  const startShiftFormattedDate = `${(startShift.getUTCMonth() + 1).toString().padStart(2, '0')}/${startShift.getUTCDate().toString().padStart(2, '0')}/${startShift.getUTCFullYear()} ${startShift.getUTCHours() % 12 || 12}${startShift.getUTCHours() >= 12 ? 'PM' : 'AM'}`;

  const endShiftFormattedDate = `${(endShift.getUTCMonth() + 1).toString().padStart(2, '0')}/${endShift.getUTCDate().toString().padStart(2, '0')}/${endShift.getUTCFullYear()} ${endShift.getUTCHours() % 12 || 12}${endShift.getUTCHours() >= 12 ? 'PM' : 'AM'}`;


  return (
      <div>
          <b>{eventInfo.timeText}</b>
          <i>{eventInfo.event.title}</i>
          <p>Category: {eventInfo.event.extendedProps.category}</p>
          <p>Start Shift: {startShiftFormattedDate}</p>
          <p>End Shift: {endShiftFormattedDate}</p>
          <p>Date Request: {eventInfo.event.extendedProps.date_request}</p>
          <p>Remarks: {eventInfo.event.extendedProps.remarks}</p>
      </div>
  );
};


export  const handleEventChange = async (changeInfo) => {
    const updatedEvent = {
      id: changeInfo.event.id,
      category: changeInfo.event._def.extendedProps.category,
      date_request: changeInfo.event._def.extendedProps.date_request,
      end_shift: changeInfo.event._instance.range.end,
      reason: changeInfo.event._def.extendedProps.reason,
      remarks: changeInfo.event._def.extendedProps.remarks,
      start_shift: changeInfo.event._instance.range.start
    };
    
    await api.patch(`/api/absent-requests/update/${updatedEvent.id}/`, updatedEvent);

  };

  export const handleCreateRequest = (newRequest, changeData) => {
    const transformedRequest = {
      title: newRequest.reason,
      start: newRequest.start_shift,
      end: newRequest.end_shift,
      extendedProps: {
        category: newRequest.category,
        date_request: newRequest.date_request,
        end_shift: newRequest.end_shift,
        reason: newRequest.reason,
        remarks: newRequest.remarks,
        start_shift: newRequest.start_shift
      }
    };
    changeData((prevRequests) => [...prevRequests, transformedRequest]);
  };

