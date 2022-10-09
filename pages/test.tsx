import Noir from "noir-js-bogota/dest/noir";

export default async function prove(geoHash, userHash) {
  const acirHex =
  "cd92bd0dc230108595bf3d32822fb6937307120d2d1b24e1022e481159e9bd411c174c00126cc4365040913a2eb8eaaa277ddf7b3ebbdadba1ee4f3447f9ef8b73fbdc0eda9c2f6474eb273fbf366cdd41f4c9e0ac1482aa828043cd0ad5a064423625028244792c90734281956a54c514084ed049c5bb6f481c2023598dc2ec63a7076a8d1ec9def7fd4883999374a1ccf9f5c692d405e0cd02f00627cbdc9f34b998b90b30f300baa737";
  const NoirJs = await Noir.new();

  const res = await NoirJs.createProof(acirHex, [geoHash.toString("hex"), userHash.toString("hex")], 32);
  const verified = await NoirJs.verifyProof(res.verifier, res.proof);
  console.log("proof verification", verified);
  console.log(res);

}
