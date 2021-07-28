import React, { useState } from "react";
import { Modal } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import moment from "moment";
import { validate } from "../api/database";

export default function ConfirmationModal({
  show,
  toggle,
  event,
  events,
  setEvent,
  setEvents,
}) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const router = useRouter();
  if (!event) return null;
  const handleCancel = () => {
    toggle();
    setEvent([]);
  };

  const handleOk = () => {
    const {
      start,
      end,
      provider,
      product_order,
      reception_zone,
      promise_date,
      provider_name,
    } = event;

    events.push(event);
    setEvents(events);

    validate(provider, product_order, start, end, reception_zone, promise_date);
    setConfirmLoading(true);

    setTimeout(() => {
      const startEvent = moment(start).toString();
      const endEvent = moment(end).toString();
      toggle(false);
      setConfirmLoading(false);
      router.replace({
        pathname: "/",
        query: { startEvent, endEvent, provider_name, product_order },
      });
    }, 2000);
  };
  return (
    <Modal
      style={{ top: "33%" }}
      title="Réserver créneau"
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      {!isEmpty(event) &&
        `Confirmer vous votre créneau ${event.start.toString()}`}
    </Modal>
  );
}
