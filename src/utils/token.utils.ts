import jwt_decode from "jwt-decode";

export function getUserFromToken(token:any, res:any) {
    try {
        let user:any = jwt_decode(token.toString())

        let userID:any = user.id;
        let userLevel:any = user.level;

        if(userID === null || userID === undefined || userID.toString() == '') {
            console.log(`[ GETUSERFROMTOKEN ] Bad request. No ID on TOKEN ${token} `); res.status(400).json({"message": "No param ID on TOKEN"}); return;
        }
        
        if(userLevel === null || userLevel === undefined || userLevel.toString() == '') {
            console.log(`[ GETUSERFROMTOKEN ] Bad request. No TYPE on TOKEN ${token} `); res.status(400).json({"message": "No param TYPE on TOKEN"}); return;
        }

        return {'id': userID, 'level': userLevel};

    } catch (error) {
        console.log(`[ GETUSERFROMTOKEN ] Error: ${error}`); res.status(500).json({"message": "Internal server error"}); return false;
    }
}