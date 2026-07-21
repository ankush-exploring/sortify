import Ticket from "../models/ticket.js";
import User from "../models/user.js";
import analyzeTicket from "../utils/ai.js";
import { sendMail } from "../utils/mailer.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
    });

    // Run AI analysis & assignment in background (don't block the response)
    processTicket(newTicket._id);

    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function processTicket(ticketId) {
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return;

    await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });

    const aiResponse = await analyzeTicket(ticket);

    if (aiResponse) {
      const skills = aiResponse.relatedSkills || [];
      await Ticket.findByIdAndUpdate(ticket._id, {
        priority: ["low", "medium", "high"].includes(aiResponse.priority)
          ? aiResponse.priority
          : "medium",
        helpfulNotes: aiResponse.helpfulNotes,
        status: "IN_PROGRESS",
        relatedSkills: skills,
      });

      // Find moderator with matching skills
      let moderator = await User.findOne({
        role: "moderator",
        skills: { $elemMatch: { $regex: skills.join("|"), $options: "i" } },
      });
      if (!moderator) {
        moderator = await User.findOne({ role: "admin" });
      }

      if (moderator) {
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: moderator._id,
        });
        await sendMail(
          moderator.email,
          "Ticket Assigned",
          `A new ticket is assigned to you: ${ticket.title}`
        );
      }
    }
  } catch (err) {
    console.error("Error processing ticket:", err.message);
  }
}

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }
    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id).populate("assignedTo", [
        "email",
        "_id",
      ]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      }).select("title description status createdAt");
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
