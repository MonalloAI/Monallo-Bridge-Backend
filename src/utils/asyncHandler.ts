import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * 包装异步路由处理函数，自动捕获错误并传递给 next()
 * 避免手动 try/catch 并符合 Express 类型要求
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
