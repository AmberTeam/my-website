import { PeraWalletConnect } from '@perawallet/connect';

const peraWallet = new PeraWalletConnect();
const walletButton = document.getElementById('wallet-button');
const qrContainer = document.getElementById('qr-code-container');

walletButton.addEventListener('click', async () => {
  try {
    qrContainer.style.display = 'block';
    const accounts = await peraWallet.connect();
    qrContainer.style.display = 'none';
    walletButton.textContent = 'Wallet Connected';
    console.log('Connected accounts:', accounts);
  } catch (error) {
    console.error('Wallet connection failed:', error);
    qrContainer.style.display = 'none';
    alert('Failed to connect wallet. Check the console for details.');
  }
});