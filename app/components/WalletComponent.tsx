declare module 'react-jdenticon';

import { useContext, useState } from "react";
import { WalletContext } from "./WalletProvider";
import Jdenticon from 'react-jdenticon';
import { isAddress } from "ethers";

const WalletComponent = () => {

    const [hovered, setHovered] = useState(true);
    const wallet = useContext(WalletContext);

    return (
        <>
            {wallet?.loggedIn && isAddress(wallet?.account) ? (
                <button
                    className='special-button flex flex-row items-center bg-beige text-black'
                    onMouseEnter={() => setHovered(false)}
                    onMouseLeave={() => setHovered(true)}
                    onClick={() => wallet?.logout()}
                >
                    {wallet?.userInfo.profileImage ? (
                        <img className="mr-2 rounded-full" src={wallet.userInfo.profileImage} width={30} height={30} />
                    ) : (
                        <div className='mr-2 rounded-full'>
                            <Jdenticon size="30" value={wallet.account} />
                        </div>
                    )}
                    <div className="stack-holder">
                        <div className={`transition-all ${hovered ? 'translate-x-0 opacity-100' : 'opacity-0 translate-x-6'}`}>
                            {wallet.account.substring(0, 6)}...{wallet.account.substring(wallet.account.length - 4, wallet.account.length)}
                        </div>
                        <div className={`transition-all ${!hovered ? 'translate-x-0 opacity-100' : 'opacity-0 translate-x-6'}`}>Logout</div>
                    </div>
                </button>
            ) : (
                <button className='special-button' onClick={() => wallet?.login()}>Login</button>
            )}
        </>
    )
}

export default WalletComponent;