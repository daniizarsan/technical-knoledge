import { Router } from 'express';
import * as middleware from '@middleware/checkToken.middleware';

const router = Router();

//
// USER
//
import * as user from '../controller/home.controller';

router.get('/user/:id/homes', user.getHomesUser);
router.get('/user/:id/filtering', user.getHomesUserFiltering);

router.post('/user/:id/homes', user.addNewHomeToUser);

router.delete('/user/:idUser/homes/:idHome', user.deleteHomeFromUser);

router.put('/user/:idUser/homes/:idHome', user.updateInfoHomeFromUser);

export default router;