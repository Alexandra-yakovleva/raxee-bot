import { CustomContext } from '../types/context';

export interface PokerRootStateRaw {
  lobbies: Record<string, {
    id: number
    userIds: number[]
  }>;
}

export class PokerRootState {
  lobbies: PokerRootStateRaw['lobbies'] = {};

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

  get lobbyByGroup() {
    return this.lobbies[this.ctx.chat!.id];
  }

  get lobbyByUser() {
    return Object.values(this.lobbies).find((lobby) => lobby.userIds.includes(this.ctx.from!.id));
  }

  get lobby() {
    return this.ctx.chat?.type === 'private' ? this.lobbyByUser : this.lobbyByGroup;
  }

  addUserToLobby() {
    if (!this.lobbyByGroup) {
      this.lobbies[this.ctx.chat!.id] = { id: this.ctx.chat!.id, userIds: [] };
    }

    this.lobbyByGroup!.userIds.push(this.ctx.from!.id);
  }

  deleteLobby() {
    if (this.lobby) {
      delete this.lobbies[this.lobby?.id];
    }
  }
}
