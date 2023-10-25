import Button from './Button';
import interactImg from '../../../assets/interact.svg';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {useAddress, useContract, useOwnedNFTs} from "@thirdweb-dev/react";
const nftDropAddress = '0x95012f5a28215B274714336F48afcB9B5aF29fe9'
export default function InteractSwitchButton() {
    const address = useAddress();
    const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
    const { data: nfts, isLoading } = useOwnedNFTs(nftDropContract, address);
    const { isAuthenticated } = useConvexAuth();
    const world = useQuery(api.world.defaultWorld);
    const userPlayerId = useQuery(api.world.userStatus, world ? { worldId: world._id } : 'skip');
    // const join = useMutation(api.world.joinWorld);
    // const leave = useMutation(api.world.leaveWorld);
    const isAuto = !!userPlayerId;

    const manualOrAutoGame = () => {
        if (!world || !isAuthenticated || userPlayerId === undefined) {
            return;
        }
        if (isAuto) {
            console.log(`Leaving game for player ${userPlayerId}`);
            // void leave({ worldId: world._id });
        } else {
            console.log(`Joining game`);
            // void join({ worldId: world._id, name: '', description: '' });
        }
    };
    if (!isAuthenticated || userPlayerId === undefined) {
        return null;
    }
    if (nfts && nfts.length === 0) {
        return null;
    }
    return (
        <Button imgUrl={interactImg} onClick={manualOrAutoGame}>
            {isAuto ? 'Auto' : 'Manual'}
        </Button>
    );
}
