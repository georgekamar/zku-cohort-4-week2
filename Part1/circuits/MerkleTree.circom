pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template CheckRoot(n) { // compute the root of a MerkleTree of n Levels
    signal input leaves[2**n];
    signal output root;

    //[assignment] insert your code here to calculate the Merkle root from 2^n leaves

    signal merkleLayers[n+1][2**n];

    for(var k = 0; k < 2**n; k++){
      merkleLayers[0][k] <== leaves[k];
    }

    component poseidons[n][2**(n-1)];

    for(var i = 0; i < n; i++){

      for(var j = 0; (j < (2**(n-i-1))); j+= 1){
        poseidons[i][j] = Poseidon(2);
        poseidons[i][j].inputs[0] <== merkleLayers[i][2*j];
        poseidons[i][j].inputs[1] <== merkleLayers[i][2*j + 1];
        merkleLayers[i+1][j] <== poseidons[i][j].out;
      }

    }

    root <== merkleLayers[n][0];

}



template MerkleTreeInclusionProof(n) {
    signal input leaf;
    signal input path_elements[n];
    signal input path_index[n]; // path index are 0's and 1's indicating whether the current element is on the left or right
    signal output root; // note that this is an OUTPUT signal

    //[assignment] insert your code here to compute the root from a leaf and elements along the path

    signal computations[n+1];
    computations[0] <== leaf;
    component hashes[n];

    for(var i = 0; i < n; i++){

      hashes[i] = Poseidon(2);

      path_index[i] * (1 - path_index[i]) === 0;
      hashes[i].inputs[0] <== (path_index[i] * (path_elements[i] - computations[i]) + computations[i]);
      hashes[i].inputs[1] <== (path_index[i] * (computations[i] - path_elements[i]) + path_elements[i]);

      computations[i+1] <== hashes[i].out;

    }

    root <== computations[n];

}
