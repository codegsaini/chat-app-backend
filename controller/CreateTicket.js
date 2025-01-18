import prisma from "../prisma/prismaInstance";

export const createTicket = async (req, res, next) => {
    try {
        const { userId, orgId, page } = req.body;
        const ticket = await prisma.ticket.create({
            data: { 
                userId: userId,
                orgId: orgId,
                page: page
             }
        });
        res.json({
            ticketId: ticket.id
        });
    } catch(e) {
        res.status(500).json({
            error: "unknown-error",
            message: "Something went wrong"
        });
    }
}