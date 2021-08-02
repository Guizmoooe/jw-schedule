import React, { useState, useEffect, useMemo } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-business-days";
import ConfirmationModal from "./ConfirmationModal";
import EditAppointementModal from "./EditAppointementModal";
import { usePlanningHours, useScheduleByZone } from "../api/bookings";
import { useRouter, withRouter } from "next/router";
import MyWorkWeek from "./MyWorkWeek";
import lodash from "lodash";
import "moment/locale/fr";

const Calendar = ({
  // schedulesByZone: scheduleData,
  planningReceptionZone: timeReceptionZone,
}) => {
  moment.locale("fr");
  const localizer = momentLocalizer(moment);
  const router = useRouter();
  const {
    id,
    provider,
    product_order,
    promise_date,
    reception_zone,
    time,
    JW,
  } = router.query;
  const { data: scheduleData } = useScheduleByZone({ reception_zone });

  // const schedulesTest = useMemo(() => {
  //   if (!toto) return [];
  //   toto.map((schedule) => {
  //     const regex = new RegExp("^(..)(\\d)(EXW+)([0-9]+)", "g");

  //     const toto = moment(schedule.start)
  //       .set({ hour: startHourPlanning, minute: startMinutePlanning })
  //       .toDate();
  //     const tata = moment(schedule.end)
  //       .set({ hour: endHourPlanning, minute: endMinutePlanning })
  //       .toDate();
  //     schedule.start = schedule.full_day ? toto : new Date(schedule.start);
  //     schedule.end = schedule.full_day ? tata : new Date(schedule.end);

  //     if (JW === "true") {
  //       return (schedule.title =
  //         schedule?.provider?.name +
  //         schedule.product_order +
  //         moment(schedule.promise_date).format("DD/MM/YYYY"));
  //     } else {
  //       return (schedule.title = "");
  //     }
  //   }),
  //     setEvents(toto);
  // }, [toto]);
  // console.log({ schedulesTest });
  const [event, setEvent] = useState([]);
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [minSlot, setMinSlot] = useState([]);

  const startHourPlanning = moment(
    timeReceptionZone?.start,
    "HH:mm:ss.sss"
  ).hours();
  const startMinutePlanning = moment(
    timeReceptionZone?.start,
    "HH:mm:ss.sss"
  ).minutes();
  const endMinutePlanning = moment(timeReceptionZone?.end, "HH:mm:ss.sss")
    .add(29, "minutes")
    .minutes();
  const endHourPlanning = moment(
    timeReceptionZone?.end,
    "HH:mm:ss.sss"
  ).hours();

  useEffect(() => {
    if (!scheduleData) return [];
    scheduleData.data.schedules.map((schedule) => {
      const regex = new RegExp("^(..)(\\d)(EXW+)([0-9]+)", "g");

      const toto = moment(schedule.start)
        .set({ hour: startHourPlanning, minute: startMinutePlanning })
        .toDate();
      const tata = moment(schedule.end)
        .set({ hour: endHourPlanning, minute: endMinutePlanning })
        .toDate();
      schedule.start = schedule.full_day ? toto : new Date(schedule.start);
      schedule.end = schedule.full_day ? tata : new Date(schedule.end);
    }),
      setEvents(scheduleData.data.schedules);
  }, [
    scheduleData,
    endHourPlanning,
    endMinutePlanning,
    startHourPlanning,
    startMinutePlanning,
  ]);

  const ColoredDateCellWrapper = ({ children }) => {
    return React.cloneElement(React.Children.only(children), {
      style: {
        backgroundColor: "#689D71",
      },
    });
  };

  const showModal = () => {
    setVisible(true);
  };
  const showModalEdit = () => {
    setVisibleEdit(true);
  };
  const fullday = false;
  const handleClickSlot = (e) => {
    const { start, end } = e;

    const test = moment(start).set({ hour: 8, minute: 0 }).toDate();
    const test2 = moment(end).set({ hour: 17, minute: 29 }).toDate();
    const newDateObj = moment(start).add(time, "m").toDate();
    const promiseDate = moment(promise_date).toDate();

    if (fullday) {
      setEvent({
        start: test,
        end: test2,
        provider: id,
        reception_zone: reception_zone,
        product_order: product_order,
        provider_name: provider,
      });
    } else {
      setEvent({
        ...e,
        provider: id,
        reception_zone: reception_zone,
        product_order: product_order,
        end: newDateObj,
        promise_date: promiseDate,
        provider_name: provider,
      });
    }
    showModal();
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#FF4901",
      },
    };
  };
  const rangeSlots = [];
  const test = lodash.sortBy(events, ["start"]);
  for (let i = 0; i < test.length; i++) {
    var a = moment(test[i].end);
    var b = moment(test[i + 1]?.start);
    const toto = b.diff(a, "minutes");
    if (toto < time && toto > 0) {
      rangeSlots.push(moment(a).toDate());
    }
  }

  const slotStyleGetter = (date) => {
    if (
      rangeSlots.find(
        (element) => moment(element).toString() == moment(date).toString()
      ) !== undefined
    ) {
      console.log("TOTO EST LA");
      return {
        style: {
          backgroundColor: "grey",
          cursor: "not-allowed !important",
        },
      };
    }
    return { style: { backgroundColor: "#689D71" } };
  };

  const EventComponent = ({ event }) => {
    if (JW === "true") {
      return `${event.provider.name}  ${event.product_order}  ${moment(
        event.promise_date
      ).format("DD-MM-YYYY")}`;
    } else if (event.provider.id === id) {
      return "Your actual reservation";
    } else {
      return "";
    }
  };
  const SlotComponent = ({ header, event }) => {
    console.log({ header });
    console.log({ event });
    // return rangeSlots.map((slot) => {
    //   const yoyo = moment(date).isBetween(
    //     moment(slot.endSlot).subtract(1, "minutes"),
    //     moment(slot.startSlot)
    //   );
    //   console.log({ yoyo });
    //   if (yoyo) {
    //     return React.cloneElement(React.Children.only(children), {
    //       style: { backgroundColor: "blue" },
    //     });
    //   } else {
    // return React.cloneElement(React.Children.only(children), {
    //   style: {
    //     backgroundColor: "#689D71",
    //   },
    // });
    //   }
    // });
    const allDateValue = useMemo(() => {
      // var c = moment(test[i].start).hours();
      // console.log(children);
      // const tata = moment(date).hours();
      // console.log({ c });
      // console.log({ tata });
    }, []);
    // console.log(allDateValue);
    return React.cloneElement(React.Children.only(children), {
      style: {
        backgroundColor: "#689D71",
      },
    });
  };
  const messages = {
    previous: "Précédent",
    next: "Suivant",
    today: "Aujourd'hui",
  };
  const onSelectEvent = (event) => {
    setEvent(event);
    showModalEdit();
  };

  return (
    <>
      <BigCalendar
        messages={messages}
        style={{ height: 1800, paddingBottom: 300 }}
        selectable={JW === "true" ? true : "ignoreEvents"}
        onSelectSlot={handleClickSlot}
        onSelectEvent={JW === "true" ? onSelectEvent : false}
        events={events}
        views={{ myWeek: MyWorkWeek }}
        defaultView={"myWeek"}
        step={30}
        defaultDate={new Date(promise_date)}
        getNow={() =>
          moment(promise_date).isBefore(moment())
            ? moment().toDate()
            : new Date(promise_date)
        }
        onNavigate={() =>
          moment(promise_date).isBefore(moment())
            ? moment().toDate()
            : new Date(promise_date)
        }
        components={{
          day: SlotComponent,
          event: EventComponent,
        }}
        toolbar={true}
        localizer={localizer}
        timeslots={1}
        eventPropGetter={eventStyleGetter}
        slotPropGetter={slotStyleGetter}
        min={new Date(0, 0, 0, startHourPlanning, startMinutePlanning)}
        max={new Date(0, 0, 0, endHourPlanning, endMinutePlanning)}
        longPressThreshold={0.1}
      />
      <ConfirmationModal
        show={visible}
        toggle={setVisible}
        event={event}
        events={events}
        setEvent={setEvent}
        setEvents={setEvents}
      />
      {JW === "true" && (
        <EditAppointementModal
          show={visibleEdit}
          toggle={setVisibleEdit}
          event={event}
          events={events}
          setEvent={setEvent}
          setEvents={setEvents}
          startHourPlanning={startHourPlanning}
          endHourPlanning={endHourPlanning}
        />
      )}
    </>
  );
};

export default withRouter(Calendar);
