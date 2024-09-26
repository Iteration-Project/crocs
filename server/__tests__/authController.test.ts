import authController from '../controllers/authController';
import User from '../models/userModel'
import type { Request } from 'express';

jest.mock('../models/userModel.js');

const makeReq = (overrides?: Record<string, any>): Partial<Request> => {
    return {
        ...overrides
    }
}

const makeRes = (overrides?: Record<string, any>) => {
    const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
        locals: {},
        ...overrides
    }
    return res;
}

describe('authController tests', () => {
    test('should verify user if valid', async () => {
      const verifiedUser = {
        _id: 123,
        name: 'Virginia Wolf',
        firstName: 'Virginia',
        lastName: 'Wolf',
        email: 'vwolf@gmail.com',
        isAdmin: true,
        newMessages: [],
      };

      const verify = jest.fn(() => Promise.resolve(verifiedUser));
      jest.spyOn(User, 'findOne').mockImplementation(() => ({ ...verifiedUser, verify } as any));

      const req = makeReq({ body: { email: 'vwolf@gmail.com', password: 'foobar' }});
      const res = makeRes();

      await authController.verifyUser(req as Request, res, jest.fn())

      expect(res.locals.verification).toEqual(expect.objectContaining({
          hasLogged: true,
          userInfo: verifiedUser
      }));
    });
});