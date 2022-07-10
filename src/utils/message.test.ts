import { buildMessageVariants, getMessageVariant } from './message';

describe('buildMessageVariants', () => {
  test('should return same value', () => {
    const variants = [() => '', () => '', () => ''];
    expect(buildMessageVariants(variants)).toBe(variants);
  });
});

describe('getMessageVariant', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.4);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  test('should return message', () => {
    const variants = buildMessageVariants([
      (user) => `${user?.first_name}, привет`,
      (user) => `${user?.first_name}, пока`,
      () => 'ла-ла-ла',
    ]);

    expect(getMessageVariant(variants, { first_name: 'bar', id: 12345, is_bot: false })).toBe('bar, пока');
  });
});
