import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import {createServer} from "node:http";
import {Server} from "socket.io";
import userRoutes from "./routes/user-routes.js";
import chatRoutes from "./routes/chat-routes.js";
import ticketRoutes from "./routes/ticket-routes.js";
import prisma from "./prisma/prismaInstance.js";
configDotenv();


const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use(chatRoutes);
app.use(ticketRoutes);
io.on('connection', (socket) => {
    socket.on("connectChat", async (data) => {
        // const data = JSON.parse(dataObj);
        const ticketId = data.ticketId;
        socket.join(ticketId);
        socket.emit("connected");
    });
    socket.on("resolve", async (data) => {
        /*
        *   Validation for company here...
        */
        const ticketId = data.ticketId;
        try {
            await prisma.ticket.update({
                where: {id: ticketId},
                data: {
                    resolved: true
                }
            });
            io.sockets.in(ticketId).emit("resolved");
        } catch(e) {
            io.sockets.in(ticketId).emit("error", "Record not found");
        }
        
    });

    socket.on("chat", async(data) => {
        // const data = JSON.parse(dataObj);
        const uid = data.uid;
        const receiverId = data.receiverId;
        const ticketId = data.ticketId;
        const reply = data.reply;
        const message = await prisma.chat.create({
            data: {
                senderId: uid,
                receiverId: receiverId,
                ticketId: ticketId,
                message: reply
            }
        });
        io.sockets.in(ticketId).emit("reply", (({id, ...restObj}) => restObj)(message));
    });
})

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})