import { text } from 'express';
import prisma from '../prisma/prismaInstance.js';

export const createUser = async (req, res, next) => {
	try {
		const { name, email, phone, pageTitle } = req.body;
		if (!name || !email || !phone)
			res.status(500).json({
				error: 'empty-field',
				message: 'Field should not be empty',
			});

		const user = await prisma.user.create({
			data: {
				name: name,
				email: email,
				phone: phone,
			},
		});

		const ticket = await prisma.ticket.create({
			data: {
				userId: user.id,
				orgId: 'org1',
				page: pageTitle,
				resolved: false,
			},
		});

		res.json({
			uid: user.id,
			ticketId: ticket.id,
			orgId: ticket.orgId,
		});
	} catch (e) {
		res.status(500).json({
			error: 'unknown-error',
			message: e?.message || 'Something went wrong',
		});
	}
};

const parseTitle = (body) => {
	let match = body.match(/<title>([^<]*)<\/title>/); // regular expression to parse contents of the <title> tag
	if (!match || typeof match[1] !== 'string')
		throw new Error('Unable to parse the title tag');
	return match[1];
};
