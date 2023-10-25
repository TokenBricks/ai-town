import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
    useContract,
    Web3Button,
    useAddress,
    useOwnedNFTs,
} from "@thirdweb-dev/react";
import interactImg from '../../../assets/interact.svg';
import {toast} from "react-toastify";
import Button from "../../components/buttons/Button.tsx";
import {useState} from "react";

const nftDropAddress = '0x95012f5a28215B274714336F48afcB9B5aF29fe9'
export default function ClaimTBAButton(
    {
        onClick,
   }:{ onClick: () => void }) {
    const address = useAddress();
    const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
    const { data: nfts, isLoading } = useOwnedNFTs(nftDropContract, address);
    const { isAuthenticated } = useConvexAuth();
    const world = useQuery(api.world.defaultWorld);
    const userPlayerId = useQuery(api.world.userStatus, world ? { worldId: world._id } : 'skip');
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    if (!isAuthenticated || userPlayerId === undefined) {
        return null;
    }
    if (nfts && nfts.length > 0) {
        return null;
    }
    return (
        <Button imgUrl={interactImg} onClick={onClick}>
            Mint TBA
        </Button>
    );
}

