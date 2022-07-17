import Head from "next/head";
import Link from "next/link";
import "./styles.css";

export default function Home() {



  
  return (
    <div className="container">
      <Head>
        <title>NFT Website</title>
        <link rel="icon" href="/favicon.ico" />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Chelsea+Market&family=Raleway:wght@400;600;800&display=swap');
        </style>
      </Head>

      <navbar className="navbar">
        <Link href="/">
          <a className="navbar-home">Home</a>
        </Link>

        <Link href="/">
          <a className="navbar-collection">Collection</a>
        </Link>

        <button className="navbar-connect">Connect Wallet</button>
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
            <button className="mintbutton">MINT</button>
          </div>
        </div>

        <div className="waitlist">
          <div className="line"></div>
          <h2 className="dropheading">Join the DROP!</h2>
          <p className="droptext">
            If you don't have MATIC to pay the gas fees for minting, don't worry
            we have got the drop waiting for you!
          </p>
          <input
            type="text"
            placeholder="Enter your Polygon wallet address here"
            className="addressinput"
          />
          <br />

          <button className="joinbutton">JOIN</button>
        </div>
      </main>

      <footer className="footer"></footer>
    </div>
  );
}
