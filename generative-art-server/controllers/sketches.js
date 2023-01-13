import * as fs from "fs";
import path from "path";
import { Web3sdksSDK } from "@web3sdks/sdk";

// Configure this to the network you deployed your contract to;
const sdk = new Web3sdksSDK("goerli");

const getScript = async (tokenId) => {
  // Your contract address from the dashboard
  const contract = await sdk.getContract("<your-contract-address-here>");
  // Get the script from the contract
  const scriptStr = await contract.call("script");
  const hash = await contract.call("tokenToHash", parseInt(tokenId));

  // this string is appended to the script-string fetched from the contract.
  // it provides hash and tokenId as inputs to the script
  const detailsForThisToken = `const tokenData = {
        hash: "${hash}",
        tokenId: ${tokenId}
    }\n
`;

  // Write the details for this token + the script to a file ../public/token/js/pieces/mySketch.js and await the result
  const filePath = path.resolve(
    path.dirname("."),
    "./public/token/js/pieces/mySketch.js"
  );

  console.log("wrote file");

  await new Promise((resolve, reject) => {
    fs.writeFile(
      filePath,
      detailsForThisToken + scriptStr.toString(),
      "utf8",
      (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("wrote file for real");

          resolve();
        }
      }
    );
  });

  return hash;
};

export { getScript };
