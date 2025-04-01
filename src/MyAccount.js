import React, { useState } from 'react';
import WalletConnect from "@walletconnect/client";
import algosdk from 'algosdk';

function MyAccount() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNfts, setShowNfts] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);

  const connectWallet = async () => {
    try {
      const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
      });
      if (!connector.connected) {
        await connector.createSession();
      }
      connector.on("connect", (error, payload) => {
        if (error) {
          setError("Failed to connect wallet");
        } else {
          const address = payload.params[0].accounts[0];
          setWalletAddress(address);
        }
      });
    } catch (err) {
      setError("Error connecting wallet");
    }
  };

  const fetchNfts = async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);
    try {
      const client = new algosdk.Indexer('', 'https://mainnet-algorand.api.purestake.io/idx2', '');
      const response = await client.lookupAccountAssets(walletAddress).do();
      const pumpkinNfts = response.assets.filter(asset => 
        asset['asset-id'] && asset.amount === 1 &&
        asset['creator'] === '2NZAIYOR6WZMR5BHDCYEU4Z5ITXSPXTK3KFQ4QOIQYYQD5BLS5DZOACB6I'
      );
      setNfts(pumpkinNfts);
      if (pumpkinNfts.length === 0) {
        setError("No PumpkinSaga NFTs found in this wallet");
      }
    } catch (err) {
      setError("Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  };

  const showNftDetails = (nft) => {
    setSelectedNft(nft);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Account</h1>
      {!walletAddress ? (
        <button onClick={connectWallet} style={styles.connectButton}>
          Connect with Pera Wallet
        </button>
      ) : (
        <>
          <p style={styles.walletText}><strong>Wallet:</strong> {walletAddress}</p>
          <button 
            onClick={() => { fetchNfts(); setShowNfts(!showNfts); }} 
            style={styles.toggleButton}
          >
            {showNfts ? 'Hide NFTs' : 'Show NFTs'}
          </button>
          {loading && (
            <div style={styles.spinner}>
              <div style={styles.spinnerInner}></div>
            </div>
          )}
          {error && <p style={styles.error}>{error}</p>}
          {showNfts && (
            <div style={styles.nftSection}>
              <h2 style={styles.subHeader}>Your PumpkinSaga NFTs</h2>
              <div style={styles.nftGrid}>
                {nfts.map((nft, index) => (
                  <div key={index} style={styles.nftCard}>
                    <img 
                      src={nft['image-url'] || 'https://via.placeholder.com/150'} 
                      alt={nft['name'] || `NFT ${nft['asset-id']}`} 
                      style={styles.nftImage} 
                    />
                    <p style={styles.nftName}>{nft['name'] || `NFT ${nft['asset-id']}`}</p>
                    <button 
                      onClick={() => showNftDetails(nft)} 
                      style={styles.detailsButton}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedNft && (
            <div style={styles.detailsSection}>
              <h3 style={styles.subHeader}>NFT Details</h3>
              <pre style={styles.metadata}>
                {JSON.stringify(selectedNft, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: { 
    padding: '30px', 
    fontFamily: "'Roboto', sans-serif", 
    maxWidth: '1200px', 
    margin: '0 auto',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh'
  },
  header: { 
    color: '#2c3e50', 
    fontSize: '36px', 
    textAlign: 'center', 
    marginBottom: '30px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  },
  connectButton: { 
    backgroundColor: '#e67e22', 
    color: 'white', 
    padding: '12px 24px', 
    border: 'none', 
    borderRadius: '25px', 
    fontSize: '18px', 
    cursor: 'pointer', 
    transition: 'background-color 0.3s',
    display: 'block',
    margin: '0 auto'
  },
  walletText: { 
    color: '#34495e', 
    fontSize: '18px', 
    marginBottom: '20px',
    wordBreak: 'break-all'
  },
  toggleButton: { 
    backgroundColor: '#3498db', 
    color: 'white', 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '20px', 
    fontSize: '16px', 
    cursor: 'pointer', 
    transition: 'background-color 0.3s'
  },
  spinner: { 
    display: 'flex', 
    justifyContent: 'center', 
    margin: '20px 0' 
  },
  spinnerInner: { 
    width: '40px', 
    height: '40px', 
    border: '4px solid #3498db', 
    borderTop: '4px solid transparent', 
    borderRadius: '50%', 
    animation: 'spin 1s linear infinite' 
  },
  error: { 
    color: '#e74c3c', 
    fontSize: '16px', 
    textAlign: 'center', 
    margin: '20px 0',
    backgroundColor: '#ffe6e6',
    padding: '10px',
    borderRadius: '5px'
  },
  nftSection: { 
    marginTop: '30px' 
  },
  subHeader: { 
    color: '#2c3e50', 
    fontSize: '24px', 
    marginBottom: '20px' 
  },
  nftGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
    gap: '20px' 
  },
  nftCard: { 
    backgroundColor: 'white', 
    borderRadius: '15px', 
    padding: '15px', 
    textAlign: 'center', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
    transition: 'transform 0.2s',
    '&:hover': { transform: 'scale(1.05)' }
  },
  nftImage: { 
    maxWidth: '100%', 
    borderRadius: '10px', 
    marginBottom: '10px' 
  },
  nftName: { 
    color: '#34495e', 
    fontSize: '16px', 
    margin: '10px 0' 
  },
  detailsButton: { 
    backgroundColor: '#9b59b6', 
    color: 'white', 
    padding: '8px 16px', 
    border: 'none', 
    borderRadius: '15px', 
    cursor: 'pointer', 
    fontSize: '14px',
    transition: 'background-color 0.3s'
  },
  detailsSection: { 
    marginTop: '30px', 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '15px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
  },
  metadata: { 
    backgroundColor: '#ecf0f1', 
    padding: '15px', 
    borderRadius: '10px', 
    fontSize: '14px', 
    whiteSpace: 'pre-wrap',
    overflowX: 'auto'
  }
};

// Add this CSS in your <head> or a separate CSS file for the spinner animation
const animationStyle = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${animationStyle}</style>`);

export default MyAccount;