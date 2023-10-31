import Button from './Button';
import interactImg from '../../../assets/interact.svg';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function OnlineButton() {
    const { isAuthenticated } = useConvexAuth();
    const world = useQuery(api.world.defaultWorld);
    const userPlayerId = useQuery(api.world.userStatus, world ? { worldId: world._id } : 'skip');
    const online = useMutation(api.world.onlineWorld);
    const offline = useMutation(api.world.offlineWorld);
    const isPlaying = !!userPlayerId;
    console.log('userPlayerId', userPlayerId)
    const joinOrLeaveGame = () => {
        if (!world || !isAuthenticated || userPlayerId === undefined) {
            return;
        }
        if (isPlaying) {
            console.log(`Leaving game for player ${userPlayerId}`);
            void offline({ worldId: world._id });
        } else {
            console.log(`Joining game`);
            void online({ worldId: world._id });
        }
    };
    if (!isAuthenticated || userPlayerId === undefined) {
        return null;
    }
    return (
        <Button imgUrl={interactImg} onClick={joinOrLeaveGame}>
            {isPlaying ? 'Offline' : 'Online'}
        </Button>
    );
}
