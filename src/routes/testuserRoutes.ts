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
//增加用户
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

// 获取单个用户信息
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  test.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: '未找到该用户' });
        return;
      }
      res.json(user);
    })
    .catch(next);
});

// 更新用户信息
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { rename, nowname, age } = req.body;

  if (!nowname || !age) {
    res.status(400).json({ message: 'nowname, age 是必填项' });
    return;
  }

  test.findByIdAndUpdate(
    id,
    {
      person: {
        name: {
          rename,
          nowname
        },
        age
      }
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).json({ message: '未找到该用户' });
        return;
      }
      res.json({ message: '✅ 用户信息已更新', data: updatedUser });
    })
    .catch(next);
});

// 删除用户
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  test.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).json({ message: '未找到该用户' });
        return;
      }
      res.json({ message: '✅ 用户已删除', data: deletedUser });
    })
    .catch(next);
});

export default router;
