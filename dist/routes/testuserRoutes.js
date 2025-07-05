"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testUser_1 = __importDefault(require("../models/testUser"));
const router = express_1.default.Router();
// 获取test 集合中的所有用户信息
router.get('/all', (_req, res, next) => {
    testUser_1.default.find()
        .then((users) => {
        res.json(users);
    })
        .catch(next);
});
//增加用户
router.post('/add', (req, res, next) => {
    const { rename, nowname, age } = req.body;
    if (!nowname || !age) {
        res.status(400).json({ message: 'nowname, age 是必填项' });
        return;
    }
    testUser_1.default.create({
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
router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    testUser_1.default.findById(id)
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
router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    const { rename, nowname, age } = req.body;
    if (!nowname || !age) {
        res.status(400).json({ message: 'nowname, age 是必填项' });
        return;
    }
    testUser_1.default.findByIdAndUpdate(id, {
        person: {
            name: {
                rename,
                nowname
            },
            age
        }
    }, { new: true })
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
router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    testUser_1.default.findByIdAndDelete(id)
        .then((deletedUser) => {
        if (!deletedUser) {
            res.status(404).json({ message: '未找到该用户' });
            return;
        }
        res.json({ message: '✅ 用户已删除', data: deletedUser });
    })
        .catch(next);
});
exports.default = router;
