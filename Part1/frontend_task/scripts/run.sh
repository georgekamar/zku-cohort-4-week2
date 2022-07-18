npx hardhat node &
sleep 5
echo slept
mkdir ./front/circuits
mkdir ./front/circuits/circuit_js
cp ../circuits/circuit_final.zkey ./front/circuits/circuit_final.zkey
cp ../circuits/circuit_js/circuit.wasm ./front/circuits/circuit_js/circuit.wasm
npx hardhat run ./back/server.js --network localhost &
cd ./front
python -m SimpleHTTPServer 3006 &
cd ..
open http://localhost:3006
lsof -i:8545
lsof -i:9000
lsof -i:3006
