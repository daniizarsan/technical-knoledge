import { Router } from 'express';
import * as middleware from '@middleware/checkToken.middleware';

const router = Router();

//
// USER
//
import * as user from '../controller/user.controller';

router.get('/user', user.getAllUsers);
router.get('/user/:id', user.getInfoUser);

router.post('/user', user.addNewUser);

router.delete('/user/:id', user.deleteUser);

router.put('/user/:id', user.updateAllInfoUser)

router.patch('/user/:id', user.updateInfoUser)

export default router;