import Head from "next/head";
import Link from "next/link";
import "./styles.css";
import { ethers } from "ethers";
import { useState } from "react";
import { address, abi } from "../extra/contracts";
import axios from "axios";

export default function Home() {
  const [providerContract, setProviderContract] = useState(undefined);
  const [signerContract, setSignerContract] = useState(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [connectButton, setConnectButton] = useState("Connect Wallet");
  const [signer, setSigner] = useState();
  const [tokenPaths, setTokenPaths] = useState([]);
  const [showMessage, setShowMessage] = useState("");
  const [dropAddress, setDropAddress] = useState({ dropAddress: "" });
  async function Connect() {
    let prov;
    let sign;
    if (typeof window.ethereum !== "undefined") {
      try {
        prov = await new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await prov.send("eth_requestAccounts", []);

        const account =
          accounts[0].slice(0, 6) + "...." + accounts[0].slice(38);
        setIsConnected(true);
        setConnectButton(account);
        sign = await prov.getSigner();
        setProviderContract(new ethers.Contract(address, abi, prov));
        setSignerContract(new ethers.Contract(address, abi, sign));
        setSigner(sign);
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  const Mint = async () => {
    if (isConnected) {
      try {
        const id = await signerContract.totalSupply();
        await signerContract.mintNFTs(1);

        document.getElementById(
          "mintmessage"
        ).innerHTML = `NFT number ${id} minted!`;
        alert("Click on Show in the NFT Collection section to view your NFT.");
      } catch (e) {
        console.log(e);
      }
    } else {
      document.getElementById("mintmessage").innerHTML = `Connect your wallet.`;
    }
  };

  const GetNFTs = async () => {
    if (isConnected) {
      try {
        let t = [];
        const userAddress = await signer.getAddress();
        const tokenAmount = await signerContract.balanceOf(userAddress);
        if (tokenAmount == 0) {
          setShowMessage("Mint an NFT first!");
        } else {
          setShowMessage("Click on the NFT to download the .png file");
        }
        for (let i = 0; i < tokenAmount; i++) {
          const tID = await providerContract.tokenOfOwnerByIndex(
            userAddress,
            i
          );

          t.push(tID);
        }
        const images = t.map((token) => {
          return "nft/" + token + ".png";
        });

        setTokenPaths(images);
      } catch (e) {
        console.log(e);
      }
    } else {
      setShowMessage("Wallet is not connected!");
    }
  };

  const ShowNFTs = () => {
    const listTokens = tokenPaths.map((t) => (
      <li className="nftlistitems">
        <a href={t} download>
          <img
            className="nftimage"
            src={t}
            alt="NFT gif image"
            width="300
          "
          />
        </a>
      </li>
    ));

    return <ul className="nftlist">{listTokens}</ul>;
  };

  const handleDrop = (e) => {
    setDropAddress({ [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    try {
      axios
        .post(
          "https://sheet.best/api/sheets/af1073e8-fa5c-4a35-ae8c-08d9fd444251",
          dropAddress
        )
        .then((response) => {
          document.getElementById(
            "dropmessage"
          ).innerHTML = `Your NFT is on its way! ETA: 24hrs`;
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>dudeNFT</title>
        <link rel="icon" href="/favicon.ico" />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Chelsea+Market&family=Raleway:wght@400;600;800&display=swap');
        </style>
      </Head>
      <div className="content">
        <navbar className="navbar">
          <button className="navbar-connect" onClick={Connect}>
            {connectButton}
          </button>
        </navbar>

        <main>
          <div className="centerpiece">
            <img
              className="gif"
              src="Gif.gif"
              alt="NFT gif image"
              width="300
          "
            />
            <div className="glass">
              <h1 className="nftname">dudeNFT</h1>
              <p className="desc">
                This collection contains 50 unique randomly generated NFTs which
                can be minted for FREE on Polygon.
              </p>
              <button className="mintbutton" onClick={Mint}>
                MINT
              </button>
              <p id="mintmessage"></p>
            </div>
          </div>

          <div className="waitlist">
            <div className="line"></div>
            <h3 className="dropheading">Join the DROP!</h3>
            <p className="droptext">
              If you don't have MATIC to pay the gas fees for minting, don't
              worry we have got the drop waiting for you!
            </p>
            <form className="dropform" onSubmit={submitHandler}>
              <input
                type="text"
                name="dropAddress"
                placeholder="Enter your Polygon wallet address here"
                className="addressinput"
                onChange={handleDrop}
                minLength="42"
                maxLength="42"
                value={dropAddress.dropAddress}
              />
              <br />

              <button className="joinbutton" type="submit">
                JOIN
              </button>
              <p className="message" id="dropmessage"></p>
            </form>
          </div>
        </main>
      </div>
      <div className="collection">
        <h2 className="gradienttext">Your NFT Collection</h2>
        <button className="viewnft" onClick={GetNFTs}>
          Show
        </button>
        <p className="showmessage">{showMessage}</p>
        <ShowNFTs />
      </div>

      <footer className="footer"></footer>
    </div>
  );
}
