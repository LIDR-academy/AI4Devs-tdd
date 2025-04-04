import { mockReset } from 'jest-mock-extended';
import { context } from './prisma-helper';

beforeEach(() => {
  mockReset(context.prisma);
});
