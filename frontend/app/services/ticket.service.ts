import { api } from "./api";

export const createTicket = async (
  subject: string,
  description: string,
  priority: string = "MEDIUM"
) => {
  if (!subject?.trim() || !description?.trim()) {
    throw new Error("INVALID_TICKET_DATA");
  }

  try {
    const res = await api.post("/ticket/create", {
      subject,
      description,
      priority,
    });

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 400) throw new Error("INVALID_TICKET_DATA");

    throw new Error("FAILED_CREATE_TICKET");
  }
};

export const getMyTickets = async () => {
  try {
    const res = await api.get("/ticket/my");
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_FETCH_TICKETS");
  }
};

export const getTicketById = async (ticketId: string) => {
  if (!ticketId?.trim()) throw new Error("INVALID_TICKET_ID");

  try {
    const res = await api.get(`/ticket/${ticketId}`);
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 404) throw new Error("TICKET_NOT_FOUND");

    throw new Error("FAILED_FETCH_TICKET");
  }
};

export const replyToTicket = async (ticketId: string, message: string) => {
  if (!ticketId?.trim()) throw new Error("INVALID_TICKET_ID");
  if (!message?.trim()) throw new Error("INVALID_REPLY_MESSAGE");

  try {
    const res = await api.post(`/ticket/${ticketId}/reply`, { message });
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 404) throw new Error("TICKET_NOT_FOUND");

    throw new Error("FAILED_REPLY_TICKET");
  }
};

export const getAllTicketsAdmin = async () => {
  try {
    const res = await api.get("/ticket/admin/all");
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");

    throw new Error("FAILED_FETCH_ALL_TICKETS");
  }
};

export const adminReplyTicket = async (
  ticketId: string,
  message: string
) => {
  if (!ticketId?.trim()) throw new Error("INVALID_TICKET_ID");
  if (!message?.trim()) throw new Error("INVALID_REPLY_MESSAGE");

  try {
    const res = await api.post(`/ticket/admin/${ticketId}/reply`, {
      message,
    });

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 404) throw new Error("TICKET_NOT_FOUND");

    throw new Error("FAILED_ADMIN_REPLY_TICKET");
  }
};