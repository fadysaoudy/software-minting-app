import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";


function App() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
    const [mintAmount, setMintAmount] = useState(1);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        WEI_COST: 0,
        DISPLAY_COST: 0,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: false,
    });

    const claimNFTs = () => {
        let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(cost * mintAmount);
        let totalGasLimit = String(gasLimit * mintAmount);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint(mintAmount)
            .send({
                gasLimit: String(totalGasLimit),
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: totalCostWei,
            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setClaimingNft(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setFeedback(
                    `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
            });
    };

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;
        if (newMintAmount > 5) {
            newMintAmount = 5;
        }
        setMintAmount(newMintAmount);
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    const getConfig = async() => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    return ( < >

            <
            div className = "content background-image pt-5 " >
            <
            div className = "card w-50 my-auto" >
            <
            div className = "row justify-content-around my-5" >
            <
            h1 className = "col-4 text-center supply-text-color" > { data.totalSupply }
            / {CONFIG.MAX_SUPPLY}</h1 >
            <
            /div>

            {
                blockchain.account === "" ||
                    blockchain.smartContract === null ? ( <
                        div className = "container" >
                        <
                        h5 className = "col-12 text-center"

                        >
                        Connect to the { CONFIG.NETWORK.NAME }
                        network <
                        /h5> <
                        div className = "col-12 text-center mb-3" >
                        <
                        button className = "text-center col-4 buttons my-4"
                        onClick = {
                            (e) => {
                                e.preventDefault();
                                dispatch(connect());
                                getData();
                            }
                        } >
                        CONNECT WITH < span className = "orange" > METAMASK < /span> < /
                        button > <
                        /div> {
                        blockchain.errorMsg !== "" ? (


                            <
                            h5 className = "col-12 text-center" > { blockchain.errorMsg } <
                            /h5>

                        ) : null
                    } <
                    /div>
            ): ( <
                >
                <
                h5 className = "col-12 text-center" > 1 NFT costs { CONFIG.DISPLAY_COST } { " " } { CONFIG.NETWORK.SYMBOL }. < /h5> <
                h5 className = "col-12 text-center my-4"

                >
                { feedback } <
                /h5>

                <
                div className = "container" >
                <
                div className = "row justify-content-center" >
                <
                button className = "col-1 buttons"
                style = {
                    { lineHeight: 0.4 }
                }
                disabled = { claimingNft ? 1 : 0 }
                onClick = {
                    (e) => {
                        e.preventDefault();
                        decrementMintAmount();
                    }
                } >
                -
                <
                /button> <
                h5 className = "col-3 text-center" > { mintAmount } <
                /h5>

                <
                button className = "col-1 buttons"
                disabled = { claimingNft ? 1 : 0 }
                onClick = {
                    (e) => {
                        e.preventDefault();
                        incrementMintAmount();
                    }
                } >
                +
                <
                /button> < /
                div >


                <
                /div>

                <
                div >
                <
                div className = "text-center col-12" >
                <
                button className = "buttons w-25 text-center my-3"
                disabled = { claimingNft ? 1 : 0 }
                onClick = {
                    (e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                    }
                } > { claimingNft ? "IN PROGRESS" : "BUY" } <
                /button> < /
                div > <
                /div> < / >
            )
        } <
        /div>
<div> <a href="https://stupendous-custard-a132cb.netlify.app/"> <button className="buttons">Go Back</button></a></div>< /
    div >

        <
        />
);
}

export default App;
