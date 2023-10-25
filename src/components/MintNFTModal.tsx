import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import ReactModal from "react-modal";
import { api } from "../../convex/_generated/api";
import {Web3Button, useAddress, useContract, useOwnedNFTs} from "@thirdweb-dev/react";
import { toast } from 'react-toastify';
import {useRef} from "react";
import clsx from "clsx";
import {useForm} from "react-hook-form";
const nftDropAddress = '0x95012f5a28215B274714336F48afcB9B5aF29fe9'

export default function MintNFTModal({
         isOpen,
         onRequestClose
    }: {
        isOpen: boolean,
        onRequestClose: () => void
    }) {
    const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm();

    const address = useAddress();
    const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
    const { data: nfts, isLoading } = useOwnedNFTs(nftDropContract, address);
    const inputRef = useRef<HTMLParagraphElement>(null);

    const { isAuthenticated } = useConvexAuth();
    const world = useQuery(api.world.defaultWorld);
    const userPlayerId = useQuery(api.world.userStatus, world ? { worldId: world._id } : 'skip');
    const join = useMutation(api.world.joinWorld);
    const leave = useMutation(api.world.leaveWorld);
    const isPlaying = !!userPlayerId;

    const joinOrLeaveGame = () => {
        if (!world || !isAuthenticated || userPlayerId === undefined) {
            return;
        }
        if (isPlaying) {
            console.log(`Leaving game for player ${userPlayerId}`);
            void leave({ worldId: world._id });
        } else {
            console.log(`Joining game`);
            void join({ worldId: world._id, name: getValues('Name'), description: getValues('Description') });
        }
    };
    if (!isAuthenticated || userPlayerId === undefined) {
        return null;
    }
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={modalStyles}
            contentLabel="Help modal"
            ariaHideApp={false}
        >
            <div className="font-body">
                <h1 className="text-center text-6xl font-bold font-display game-title">Mint TBA NFT</h1>
                <p>
                    AI Cosmos NFT: Name and Infuse Character into Your NFT
                </p>
                {/*<h2 className="text-4xl mt-4">Name and Infuse Character</h2>*/}
                <form>
                    <div className="flex flex-col text-2xl  mt-4 mb-2">
                        <label className="mb-2">Name</label>
                        <input placeholder="Your Name" className="text-black" {...register("Name")} />
                    </div>
                    <div className="flex flex-col text-2xl mt-4">
                        <label className="mb-2">Description</label>
                        <textarea placeholder="Your Description" className="text-black" {...register("Description")} rows={7}></textarea>
                    </div>
                </form>
                <div className="flex justify-center mt-8">
                    <Web3Button
                        contractAddress={nftDropAddress}
                        action={async (contract) => {
                            await contract?.erc721.claim(1);
                        }}
                        onSuccess={() => {
                            joinOrLeaveGame()
                            onRequestClose()
                            toast.success(`"NFT Minted!`)
                        }}
                        onError={(e) => {
                            console.log(e);
                            toast.error(`NFT Mint Failed! Reason: ${e.message}`)
                        }}
                        isDisabled={isPlaying || (nfts && nfts.length > 0)}
                    >
                        Mint NFT
                    </Web3Button>
                </div>
            </div>
        </ReactModal>
    );
}
const modalStyles = {
    overlay: {
        backgroundColor: 'rgb(0, 0, 0, 75%)',
        zIndex: 12,
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '50%',

        border: '10px solid rgb(23, 20, 33)',
        borderRadius: '0',
        background: 'rgb(35, 38, 58)',
        color: 'white',
        fontFamily: '"Upheaval Pro", "sans-serif"',
    },
};
