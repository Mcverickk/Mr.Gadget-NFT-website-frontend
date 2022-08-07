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
  const [provider, setProvider] = useState();
  const [tokenPaths, setTokenPaths] = useState([]);
  const [showMessage, setShowMessage] = useState("");
  const [dropAddress, setDropAddress] = useState({ dropAddress: "" });
  const [accountAddress, setAccountAddress] = useState();

  async function Connect() {
    let prov;
    let sign;
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x89",
              rpcUrls: ["https://rpc-mainnet.matic.network/"],
              chainName: "Matic Mainnet",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              blockExplorerUrls: ["https://polygonscan.com/"],
            },
          ],
        });
        // await prov.send(
        //   "wallet_switchEthereumChain",
        //   [{ chainId: "0x89" }] // chainId must be in hexadecimal numbers
        // );
        prov = await new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await prov.send("eth_requestAccounts", []);
        setAccountAddress(accounts[0]);

        //await prov.send("wallet_addEthereumChain", [polygonNetwork]);

        const account =
          accounts[0].slice(0, 6) + "...." + accounts[0].slice(38);
        setIsConnected(true);
        setConnectButton(account);
        sign = await prov.getSigner();
        setProviderContract(new ethers.Contract(address, abi, prov));
        setSignerContract(new ethers.Contract(address, abi, sign));
        setSigner(sign);
        setProvider(prov);
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
        const tokenAmount = await signerContract.balanceOf(accountAddress);
        if (tokenAmount < 3) {
          await provider.send(
            "wallet_switchEthereumChain",
            [{ chainId: "0x89" }] // chainId must be in hexadecimal numbers
          );
          const id = await signerContract.totalSupply();
          if (id < 241) {
            await signerContract.mintNFTs();

            document.getElementById(
              "mintmessage"
            ).innerHTML = `NFT number ${id} minted!`;
            alert(
              "View your NFT in the collection section. (It may take 10-20s to process the transaction)"
            );
          } else {
            document.getElementById(
              "mintmessage"
            ).innerHTML = `All NFTs have been minted! `;
          }
        } else {
          document.getElementById(
            "mintmessage"
          ).innerHTML = `You can't mint more than 3 NFTs.`;
        }
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
        t = await signerContract.tokensOfOwner(accountAddress);
        if (t.length == 0) {
          setShowMessage("Oops! You forgot to mint the NFT!");
        } else {
          setShowMessage("Rendering images...");
          const images = t.map((token) => {
            return "nft/" + token + ".png";
          });
          setTokenPaths(images);
          setShowMessage("Click on the NFT to download the .png file");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      setShowMessage("Wallet is not connected!");
    }
  };

  const ShowNFTs = () => {
    try {
      const listTokens = tokenPaths.map((t) => (
        <li className="nftlistitems">
          <a href={t} download>
            <img
              className="nftimage"
              src={t}
              alt="NFT image"
              width="300
            "
            />
          </a>
        </li>
      ));

      return <ul className="nftlist">{listTokens}</ul>;
    } catch (e) {
      console.log(e);
    }
  };

  const handleDrop = (e) => {
    setDropAddress({ [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (dropAddress.dropAddress == "") {
        document.getElementById(
          "dropmessage"
        ).innerHTML = `Enter your wallet address.`;
      } else {
        document.getElementById(
          "dropmessage"
        ).innerHTML = `Your NFT is on its way! ETA: 24hrs`;
        await axios.post(
          "https://sheet.best/api/sheets/83eba305-0bd6-4376-8e0c-b797678f66a3",
          dropAddress
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const About = (props) => {
    return (
      <div className="glass2">
        <img src={props.image} className="chiragnft" />
        <h2 className="name">{props.name}</h2>
        <h3 className="role">{props.role}</h3>
        <div className="socials">
          <a href={props.linkedin} target="_blank">
            <img src="linkedin.png" className="linkedin" />
          </a>
          <a href={props.insta} target="_blank">
            <img src="instagram.png" className="insta" />
          </a>

          <a href={props.twitter} target="_blank">
            <img src="twitter.png" className="twitter" />
          </a>
          <a href={props.github} target="_blank">
            <img src="github.png" className="github" />
          </a>
        </div>
      </div>
    );
  };

  const AboutSutanay = (props) => {
    return (
      <div className="glass2">
        <img src={props.image} className="chiragnft" />
        <h2 className="name">{props.name}</h2>
        <h3 className="role">{props.role}</h3>
        <div className="socials">
          <a href={props.linkedin} target="_blank">
            <img src="linkedin.png" className="linkedin" />
          </a>
          <a href={props.insta} target="_blank">
            <img src="instagram.png" className="insta" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Head>
        <title>Mr. Gadget NFT</title>
        {/* <link rel="icon" type="image/x-icon" href="head.png"></link> */}

        <link rel="icon" href="/favicon.ico" />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Chelsea+Market&family=Raleway:wght@400;600;800&display=swap');
        </style>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Bitter:wght@300;400;500;600&family=Bungee&family=Montserrat+Alternates:wght@600;700&family=Orbitron:wght@600;700&family=Teko:wght@400;500;600&display=swap');
        </style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
              src="nft.gif"
              alt="NFT gif image"
              width="300
          "
            />
            <div className="glass">
              <h1 className="nftname">Mr.Gadget</h1>
              <p className="desc">
                This collection contains 241 uniquely generated NFTs which can
                be minted for FREE on Polygon.
              </p>
              <button className="mintbutton">
                SOLD OUT!
              </button>
              <p className="mintmessage" id="mintmessage"></p>
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
      <div className="aboutcontainer">
        <h3 className="team">Creators</h3>
        <div className="about">
          <About
            image="chirag.png"
            name="Chirag Agarwal"
            role="Techie"
            linkedin="https://www.linkedin.com/in/chiragagarwal2001/"
            insta="https://www.instagram.com/chitrachirag_"
            twitter="https://twitter.com/mcverickk"
            github="https://github.com/Mcverickk"
          />
          <AboutSutanay
            image="sutanay.png"
            name="Sutanay Nandi"
            role="Artist"
            linkedin="https://www.linkedin.com/in/sutanay-nandi-948b521a6/"
            insta="https://instagram.com/f.u.b.a.r001?igshid=YmMyMTA2M2Y="
          />
        </div>
        <p className="thanks">
          Special thanks to Tarun for helping with the website design.
        </p>
      </div>
    </div>
  );
}
