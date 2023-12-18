import { Router } from 'express';

const router = Router();


import user from './user.router';
import home from './home.router';

router.use('/', user);
router.use('/', home);

export default router;