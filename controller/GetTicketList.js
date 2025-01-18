import prisma from "../prisma/prismaInstance.js";

export const getTicketList = async (req, res, next) => {
    try {
        const { orgId } = req.body;
        const ticketList = await prisma.ticket.findMany({
            where: { orgId: orgId }
        });
        const response = [];
        for (let i = 0; i < ticketList.length; i++) {
            let obj = {ticket: ticketList[i]};
            const user = await prisma.user.findUnique({
                where: { id: ticketList[i].userId }
            });
            obj["user"] = user;
            obj["page"] = ticketList[i].page;
            const latestChat = await prisma.chat.findFirst({
                where: { ticketId: ticketList[i].id },
                orderBy: {
                    id: "desc"
                }
            });
            obj["lastMessage"] = latestChat?.message || "";
            response.push(obj);
        }
        res.send(response);
    } catch(e) {
        res.status(500).json({
            error: "unknown-error",
            message: e?.message || "Something went wrong"
        });
    }
}