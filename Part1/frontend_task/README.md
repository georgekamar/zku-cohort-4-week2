Hello, I have written a run.sh script in the scripts folder of the frontend_task directory, it should be run from the root of the frontend_task directory.

However, I am a beginner at scripting and have to add this disclaimer:

DISCLAIMER:

  1- There is a manual sleep command to wait for the `npx hardhat node` command to finish, it waits for 5 seconds but it could take longer and then the script would not work
  2- I do not kill any processes after the script is closed, so the servers from `hardhat node` command, the server from the `npx hardhat run ./back/server.js --network localhost` and the server from the `python -m SimpleHTTPServer` commands do not stop running. I have added lsof -i:(port) commands in the script to identify the process IDs of these tasks so that you may quit them manually if need be.
  3- If you prefer running these commands manually (I would recommend it), you can open 3 terminal windows and run `npx hardhat node` in one, `npx hardhat run ./back/server.js --network localhost` in the second one, and `python -m SimpleHTTPServer 3006` in the third one. Then opening your browser on `http://localhost:3006` should show you the front end. Please note that circuit_js/circuit.wasm and circuit_final.zkey files should be copied in a circuits directory within front that matches the structure of the circuits directory they are copied from. (see script lines 4 to 7)
