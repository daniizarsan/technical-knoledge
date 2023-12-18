import config from '@config'
import jwt from 'jsonwebtoken';

function checkUser(token:any, req:any, res:any) {
	try {
		let user:any = token

		let userID:any = user.id;
		let userLevel:any = user.level;

		if(userID === null || userID === undefined || userID.toString() == '') {
			res.status(400).json({"message": "Param ID not found on TOKEN"}); return;
		}
		
		if(userLevel === null || userLevel === undefined || userLevel.toString() == '') {
			res.status(400).json({"message": "Param LEVEL not found on TOKEN"}); return;
		}

		return {'id': userID, 'level': userLevel};
	} catch (error) {
		console.log(`[ CHECKUSER ] Error: ${error}`); res.status(500).json({"message": "Internal server error"}); return false;
	}
}

export async function checkUserLevelAdmin (req:any, res:any, next:any) {
	if ( !req.headers.token ){
		console.log(`[ CHECKUSERLEVEL ADMIN] UNAUTHORIZED (401). Token: ${req.headers.token}`); res.status(401).json({"message": "Unauthorized"}); return;		
	}

	try {
		const token = jwt.verify(req.headers.token.toString(),config.JWT_SECRET)
		let user:any = checkUser(token, req, res)
		if ( !user ) {
			res.status(401).json({"error": "Unauthorized. Bad token"}); return;
		}
		
		if ( user.level != 'ADMIN' ){
			res.status(403).json({"error": "Forbidden"}); return;
		}

		next();
	} catch (error) {
		console.log(`[ CHECKUSERLEVEL ADMIN] Error: ${error}`); res.status(500).json({"message": "Internal server error"}); return;
	}
}

export async function checkToken (req:any, res:any, next:any) {
	if ( !req.headers.token ){
		console.log(`[ CHECK TOKEN ] UNAUTHORIZED (401). Token: ${req.headers.token}`); res.status(401).json({"message": "Unauthorized"}); return;		
	}

	try {
		const token = jwt.verify(req.headers.token.toString(),config.JWT_SECRET)
		let user:any = checkUser(token, req, res)
		if ( !user ) {
			res.status(401).json({"error": "Unauthorized. Bad token"})
		}

		if ( user.level != 'ADMIN' && user.level != 'CLIENT' ){
			res.status(403).json({"error": "Forbidden"}); return;
		}

		next();
	} catch (error) {
		console.log(`[ CHECK TOKEN ] Error: ${error}`); res.status(500).json({"message": "Internal server error"}); return;
	}
}