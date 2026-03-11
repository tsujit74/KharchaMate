import Ticket from "../models/Ticket.js";

export const createTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;

    const ticket = await Ticket.create({
      user: req.user.id,
      subject,
      description,
      priority,
      messages: [
        {
          sender: req.user.id,
          role: "USER",
          message: description,
        },
      ],
    });

    const user = await User.findById(req.user.id).select("name");

    notifyAdmin({
      title: "New Support Ticket",
      message: `${user.name} created ticket "${subject}"`,
      type: "NEW_TICKET",
      relatedId: ticket._id,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create ticket",
    });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "messages.sender",
      "name email",
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket",
    });
  }
};

export const replyToTicket = async (req, res) => {
  try {
    const { message } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.messages.push({
      sender: req.user.id,
      role: "USER",
      message,
    });

    await ticket.save();

    res.json({
      success: true,
      message: "Reply added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reply",
    });
  }
};
