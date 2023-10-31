import { agentInputs } from './agents';
import { ObjectType, v } from 'convex/values';
import { movePlayer, stopPlayer } from './movement';
import { conversationInputs } from './conversations';
import { point } from '../util/types';
import type { AiTown } from './aiTown';
import { inputHandler } from './inputHandler';
import {joinGame, leaveGame, onlineGame} from './players';

// Join, creating a new player...
export const join = inputHandler({
  args: {
    name: v.string(),
    character: v.string(),
    description: v.string(),
    tokenIdentifier: v.optional(v.string()),
  },
  handler: async (game, now, args) => {

    const playerId = await joinGame(
      game,
      now,
      args.name,
      args.character,
      args.description,
      args.tokenIdentifier,
    );
    // await game.agents.insert({
    //   worldId: game.world._id,
    //   playerId: playerId,
    //   identity: args.description,
    //   plan: 'You want to make friends with other people',
    //   isActive: false
    // })
    return playerId;
  },
});
const online = inputHandler({
    args: {
        playerId: v.id("players"),
    },
    handler: async (game: AiTown, now: number, { playerId }) => {
        await onlineGame(game, now, playerId);
        return null;
    }
})

const offline = inputHandler({
    args: {
        playerId: v.id("players"),
    },
    handler: async (game: AiTown, now: number, { playerId }) => {
        await leaveGame(game, now, playerId);
        return null;
    }
})
// ...or leave, disabling the specified player.
const leave = inputHandler({
  args: {
    playerId: v.id('players'),
  },
  handler: async (game: AiTown, now: number, { playerId }) => {
    await leaveGame(game, now, playerId);
    return null;
  },
});
// Move the player to a specified location.
const moveTo = inputHandler({
  args: {
    playerId: v.id('players'),
    destination: v.union(point, v.null()),
  },
  handler: async (game: AiTown, now: number, { playerId, destination }) => {
    if (destination !== null) {
      movePlayer(game, now, playerId, destination);
    } else {
      stopPlayer(game, now, playerId);
    }
    return null;
  },
});
export const inputs = {
  join,
  leave,
  online,
  offline,
  moveTo,
  // Inputs for the messaging layer.
  ...conversationInputs,
  // Inputs for the agent layer.
  ...agentInputs,
};
export type Inputs = typeof inputs;
export type InputNames = keyof Inputs;
export type InputArgs<Name extends InputNames> = ObjectType<Inputs[Name]['args']>;
export type InputReturnValue<Name extends InputNames> = ReturnType<
  Inputs[Name]['handler']
> extends Promise<infer T>
  ? T
  : never;
