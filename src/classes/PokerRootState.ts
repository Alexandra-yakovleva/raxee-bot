import { CustomContext } from '../types/context';

export interface PokerLobby {
  id: number
  userIds: number[]
}

export interface PokerRootStateRaw {
  lobbies: Record<string, PokerLobby>;
}

export class PokerRootState {
  lobbies: Record<string, PokerLobby> = {};

  constructor(public ctx: CustomContext) {}

  static fromRaw(ctx: CustomContext, raw: PokerRootStateRaw) {
    const instance = new PokerRootState(ctx);
    instance.lobbies = raw.lobbies;
    return instance;
  }

  toRaw(): PokerRootStateRaw {
    return {
      lobbies: this.lobbies,
    };
  }

  get lobbyByGroup(): PokerLobby | undefined {
    if (this.ctx.chat!.type === 'private') {
      throw new Error('lobbyByGroup called in private chat');
    }

    return this.lobbies[this.ctx.chat!.id];
  }

  get lobbyByUser(): PokerLobby | undefined {
    return Object.values(this.lobbies).find((lobby) => lobby.userIds.includes(this.ctx.from!.id));
  }

  get lobby(): PokerLobby | undefined {
    return this.ctx.chat!.type === 'private' ? this.lobbyByUser : this.lobbyByGroup;
  }

  addUserToLobby() {
    if (this.ctx.chat!.type === 'private') {
      throw new Error('addUserToLobby called in private chat');
    }

    if (!this.lobbies[this.ctx.chat!.id]) {
      this.lobbies[this.ctx.chat!.id] = {
        id: this.ctx.chat!.id,
        userIds: [],
      };
    }

    this.lobbies[this.ctx.chat!.id].userIds.push(this.ctx.from!.id);
  }

  removeLobby() {
    if (this.lobby) {
      delete this.lobbies[this.lobby.id];
    }
  }
}
