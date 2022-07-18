const { poseidonContract } = require("circomlibjs");
const hre = require("hardhat");

http = require("http");
const port = 9000;

async function main() {
  const PoseidonT3 = await hre.ethers.getContractFactory(
      poseidonContract.generateABI(2),
      poseidonContract.createCode(2)
  )
  const poseidonT3 = await PoseidonT3.deploy();
  await poseidonT3.deployed();

  const MerkleTree = await hre.ethers.getContractFactory("MerkleTree", {
      libraries: {
          PoseidonT3: poseidonT3.address
      },
    });
  merkleTree = await MerkleTree.deploy();
  await merkleTree.deployed();

  return Promise.resolve({
    merkleTree
  })

}

main()
.then(({merkleTree}) => {

  const insert = async (body) => {
    const data = await JSON.parse(body || null);
    const transactionData = await merkleTree.insertLeaf(data?.leafValue || 0);
    return transactionData;
  }

  const hash = async (body) => {
    const data = await JSON.parse(body || null);
    const node = (await merkleTree.hashes(data?.index)).toString();
    return {node};
  }

  const verify = async (body) => {
    const data = await JSON.parse(body || null);
    const argv = data?.calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
    const c = [argv[6], argv[7]];
    const input = argv.slice(8);
    const verification = await merkleTree.verify(a, b, c, input);
    console.log(verification)
    return {verification}
  }

  const routeMap = {
    "/insert": insert,
    "/hash": hash,
    "/verify": verify
  };

  http.createServer(async (req, res) => {

    // concat body data
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const body = Buffer.concat(buffers).toString();

    if(routeMap?.[req.url] && req.method === 'POST'){
      routeMap[req.url](body).then((data) => {
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        });
        res.write(JSON.stringify(data));
        res.end();
      }).catch((e) => {
        console.log(e)
        res.writeHead(400, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        });
        res.end()
      });
    } else {
      res.writeHead(404, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.end();
    }
  })
  .listen(port);
  console.log(`The server has started and is listening on port number: ${port}`);
})
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
