import { PokerRootState } from './PokerRootState';

describe('#fromRaw', () => {
  test('should properly build from raw', () => {
    const state = PokerRootState.fromRaw({} as any, {
      lobbies: {
        123: {
          id: 123,
          userIds: [456, 789],
        },
        321: {
          id: 321,
          userIds: [321, 321],
        },
      },
    });

    expect(state.lobbies).toStrictEqual({
      123: {
        id: 123,
        userIds: [456, 789],
      },
      321: {
        id: 321,
        userIds: [321, 321],
      },
    });
  });
});

describe('#toRaw', () => {
  test('should properly build raw', () => {
    const state = new PokerRootState({} as any);
    state.lobbies = {
      123: {
        id: 123,
        userIds: [456, 789],
      },
      321: {
        id: 321,
        userIds: [321, 321],
      },
    };

    expect(state.toRaw()).toStrictEqual({
      lobbies: {
        123: {
          id: 123,
          userIds: [456, 789],
        },
        321: {
          id: 321,
          userIds: [321, 321],
        },
      },
    });
  });
});
