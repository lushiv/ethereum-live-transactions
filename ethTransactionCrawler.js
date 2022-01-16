const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
let Web3 = require('web3');
// You can Switch Endpoints from [MAINNET, RINKEBY TESTNET etc] from  env conf files
nodeHttpsUrl = process.env.INFURA_ROPSTEN_HTTPS_URL+process.env.INFURA_PROJECT_ID;
nodeWssUrl = process.env.INFURA_ROPSTEN_WSS_URL+process.env.INFURA_PROJECT_ID;

function ethTransactionCrawler(address) {
    try {
        
        //connect the web3 with node
        const web3ws = new Web3(new Web3.providers.WebsocketProvider(nodeWssUrl));
        Web3 = new Web3(new Web3.providers.HttpProvider(nodeHttpsUrl));

        address = address.toLowerCase();
        console.log(`Crawling address is: ${address}`)

        subscribeTrnx = web3ws.eth.subscribe('pendingTransactions') //TODO
        console.log('Watching the all pending transactions.............');

        this.subscribeTrnx.on('data', (txHash) => {
          setTimeout(async () => {
              try {
                  let trnxData = await Web3.eth.getTransaction(txHash);
                  if (trnxData !== null || trnxData !==undefined) {
                    const crawledAddress = trnxData?.to?.toLowerCase()
                    console.log(`Matching this crawled address: ${crawledAddress} with our address: ${address}`)
                      if (address ==crawledAddress) {
                        console.log('Address Matched')
                          console.log({fromAddress: trnxData.from, 
                                       value: Web3.utils.fromWei(trnxData.value, 'ether'), 
                                       toAddress : trnxData.to,
                                       blockNumber: trnxData.blockNumber,
                                       timestamp: new Date(),
                                      });
                      }
                  }
              } catch (err) {
                  console.error(err);
              }
          }, 60000)
      });
      return true;
    } catch {
      const error = new Error()
      console.log(error.stack)
    }
  }
  ethTransactionCrawler('0x281b3b65ae71fc4ebba61325a6bc2974b80f04c2')