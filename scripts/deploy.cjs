const hre = require('hardhat');

async function main() {
  try {
    // Get the contract factory
    const PaymentPlatform = await hre.ethers.getContractFactory(
      'PaymentPlatform'
    );

    // Deploy the contract
    console.log('Deploying PaymentPlatform contract...');
    const paymentPlatform = await PaymentPlatform.deploy();

    const contractAddress = await paymentPlatform.address;

    console.log('PaymentPlatform contract deployed to:', contractAddress);
    console.log('Save this address for interaction script!');
  } catch (error) {
    console.error('Error during deployment:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
