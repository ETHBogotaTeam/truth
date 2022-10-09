import { compile, acir_from_bytes } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof, verify_proof, create_proof_with_witness } from '@noir-lang/barretenberg/dest/client_proofs';
import { packed_witness_to_witness, serialise_public_inputs, compute_witnesses } from '@noir-lang/aztec_backend';
import path from 'path';
import { readFileSync } from 'fs';
import process from 'process'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { NFTStorage, File, Blob } from 'nft.storage'
import fetch from 'cross-fetch';
import Noir from "noir-js-bogota/dest/noir";


export default async function noirToIPFS(geoHash, userHash) {



  const acirHex =
  "cd92bd0dc230108595bf3d32822fb6937307120d2d1b24e1022e481159e9bd411c174c00126cc4365040913a2eb8eaaa277ddf7b3ebbdadba1ee4f3447f9ef8b73fbdc0eda9c2f6474eb273fbf366cdd41f4c9e0ac1482aa828043cd0ad5a064423625028244792c90734281956a54c514084ed049c5bb6f481c2023598dc2ec63a7076a8d1ec9def7fd4883999374a1ccf9f5c692d405e0cd02f00627cbdc9f34b998b90b30f300baa737";
  const NoirJs = await Noir.new();

  const res = await NoirJs.createProof(acirHex, [geoHash.toString("hex"), userHash.toString("hex")], 32);
  const verified = await NoirJs.verifyProof(res.verifier, res.proof);
  console.log("proof verification", verified);
  console.log(res);

  // const axios = require('axios');
  // axios.get('https://eth-bogota-46d84-default-rtdb.firebaseio.com/users.json')
  // .then(function (response) {
  //   // handle success
  //   console.log(response.data);
  // })
  // .catch(function (error) {
  //   // handle error
  //   console.log(error);
  // })
  // .then(function () {
  //   // always executed
  // });


  // const compiled_program = compile(path.resolve(__dirname, './func.nr'));

  // let acir = compiled_program.circuit;
  // const abi = compiled_program.abi;

  // // Take arguments from API
  // abi.geo_hash = 3;
  // abi.user_hash = 4;

  // let [prover, verifier] = await setup_generic_prover_and_verifier(acir);

  // const proof = await create_proof(prover, acir, abi);

  // const verified = await verify_proof(verifier, proof);

  // console.log(verified);


  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGIzZjNjMWM0ZjMxOTNmODI4ODlEZTZBMmVjRjAxMmQwQ0VjRjQ4NUYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc5OTYxODUzNDUsIm5hbWUiOiJGUy1IQUNLIn0.zi3M741ubRNKN5n5YumSenNZmqR8ToHtQi4idlmKOHY";


  // Function will take image, Node.js doesn't have FILE, need to use Fs

  //const imageFile = new File(["THIS NEEDS TO BE AN IMAGE"], "image", { type: 'text/plain' });
  // const sourceFile = new File('console.log("hello, world")', 'src/index.js', { type: 'text/javascript' });

  const storage = new Web3Storage({ token })


  const blob = new Blob([JSON.stringify({proof: proof, imageFile: "imagefile.com"})], { type: 'application/json' })
  const finalFile = [new File([blob], 'hello.json')]


  const cid = await storage.put(finalFile);
  console.log('Content added with CID:', cid)


}
noirToIPFS()
