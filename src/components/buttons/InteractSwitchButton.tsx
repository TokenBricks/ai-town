import Button from './Button';
import interactImg from '../../../assets/interact.svg';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function InteractButton() {
    const { isAuthenticated } = useConvexAuth();
    const world = useQuery(api.world.defaultWorld);
    const userPlayerId = useQuery(api.world.userStatus, world ? { worldId: world._id } : 'skip');
    const join = useMutation(api.world.joinWorld);
    const leave = useMutation(api.world.leaveWorld);
    const isPlaying = !!userPlayerId;

    const manualOrAutoGame = () => {
        if (!world || !isAuthenticated || userPlayerId === undefined) {
            return;
        }
        if (isPlaying) {
            console.log(`Leaving game for player ${userPlayerId}`);
            void leave({ worldId: world._id });
        } else {
            console.log(`Joining game`);
            void join({ worldId: world._id, name: '', description: '' });
        }
    };
    if (!isAuthenticated || userPlayerId === undefined) {
        return null;
    }
    return (
        <Button imgUrl={interactImg} onClick={manualOrAutoGame}>
            {isPlaying ? 'Auto' : 'Manual'}
        </Button>
    );
}
