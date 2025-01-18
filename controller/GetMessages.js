import prisma from "../prisma/prismaInstance.js";

export const getMessages = async (req, res, next) => {
    try {
        const { ticketId } = req.body;
        const messages = await prisma.chat.findMany({
            where: { ticketId: ticketId }
        });
        res.send(messages);
    } catch(e) {
        res.status(500).json({
            error: "unknown-error",
            message: e?.message || "Something went wrong"
        });
    }
}