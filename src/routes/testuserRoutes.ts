import express, { Request, Response, NextFunction } from 'express';
import test from '../models/testUser';


const router = express.Router();



// 获取test 集合中的所有用户信息
router.get('/all', (_req, res, next: NextFunction) => {
  test.find()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

router.post('/add', (req:Request, res:Response, next: NextFunction) => {
  const { rename, nowname, age } = req.body;

  if ( !nowname || !age) {
    res.status(400).json({ message: 'nowname, age 是必填项' });
    return;
  }

  test.create({
    person: {
      name: {
        rename,
        nowname
      },
      age
    }
  })
    .then((newUser) => {
      res.status(201).json({ message: '✅ 用户创建成功', data: newUser });
    })
    .catch((err) => {
      console.error('❌ 创建用户出错:', err);
      next(err);
    });
});


export default router;
