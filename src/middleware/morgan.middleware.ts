import config from '@config';
import { Request, Response } from 'express';

enum LogLevel { ERROR, DEBUG, INFO }

const requestCounters: { [key: string]: { 'total': number, 'errors': number  } } = {};

export const controlAccesMorgan = (tokens:any, req: Request, res: Response) => {
	const ip = req.socket.remoteAddress

	if (!requestCounters[ip]) {
		requestCounters[ip] = {
			'total': 0,
			'errors': 0
		}
	}

	if (parseInt(tokens.status(req, res)) >= 400) {
		requestCounters[ip]['errors']++;
	}

	requestCounters[ip]['total']++;

}

export const controlLogsMorgan = (tokens:any, req: Request, res: Response) => {
	const status = parseInt(tokens.status(req, res))
	const level:LogLevel = (<any>LogLevel)[config.LOG_LEVEL]
	controlAccesMorgan(tokens, req, res)

	switch (level) {
		case LogLevel.ERROR:

			if (status >= 400) {
				return formatOutput(tokens, req, res) 
			}
			break;

		case LogLevel.DEBUG:
			const enable = [200, 201, 202, 400, 401, 403, 404, 409, 500]

			if (enable.includes(status)) {
				return formatOutput(tokens, req, res) 
			}
			break;

		case LogLevel.INFO:
			return formatOutput(tokens, req, res) 

		default:
			return formatOutput(tokens, req, res) 
	}
}

function formatOutput (tokens:any, req: Request, res: Response) {
	const ip = req.socket.remoteAddress
	const max = requestCounters[ip]['total'].toString().length

	return `IP: ${ip.split(":").pop().padStart(10, ' ')} (T:${requestCounters[ip]['total'].toString().padStart(max, ' ')}) (E:${requestCounters[req.socket.remoteAddress]['errors'].toString().padStart(max, ' ')}) | ${tokens.status(req, res)} ${tokens.method(req, res)} ${tokens.url(req, res)} - ${tokens['response-time'](req, res)} ms `	
}