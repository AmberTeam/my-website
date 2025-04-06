// Polyfill global for browser compatibility
const global = window;

// Add CSS class for QR container visibility
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .qr-visible {
    display: block !important;
  }
`;
document.head.appendChild(styleSheet);

// Wallet connection logic
document.addEventListener('DOMContentLoaded', () => {
  const walletButton = document.getElementById('wallet-button');
  const qrCodeContainer = document.getElementById('qr-code-container');
  const qrCodeDiv = document.getElementById('qr-code');

  walletButton.addEventListener('click', () => {
    // Toggle QR visibility with class instead of inline style
    qrCodeContainer.classList.toggle('qr-visible');

    // Example QR code generation (replace with your actual logic)
    const qrText = 'https://example.com/wallet-connect'; // Replace with real wallet data
    qrCodeDiv.textContent = ''; // Clear previous content
    const qrCanvas = document.createElement('canvas');
    qrCodeDiv.appendChild(qrCanvas);

    // Assuming QRCode library is included in your bundle
    if (typeof QRCode === 'function') {
      new QRCode(qrCanvas, {
        text: qrText,
        width: 128,
        height: 128,
      });
    } else {
      qrCodeDiv.textContent = 'QR Code library not loaded';
    }
  });
});

// Export for module compatibility
export default {};