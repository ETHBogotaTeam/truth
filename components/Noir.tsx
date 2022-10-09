import { useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Input,
  Container,
  Textarea,
  Image,
  FormControl,
  FormLabel,
  InputLeftAddon,
  AspectRatio,
  InputGroup,
} from "@chakra-ui/react";

import Geohash from 'latlon-geohash';
import {publicIp, publicIpv4, publicIpv6} from 'public-ip';
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { NFTStorage, File, Blob } from 'nft.storage'
import Noir from "noir-js-bogota/dest/noir";



export default function NoirComponent() {
  const [fileUrl, setFileUrl] = useState("");
  const [formInput, setFormInput] = useState({
    name: "Troofy McTrooferson",
    description: "I'm fighting for my right, my right to parrrrrttyyyyyyy",
    datetime: "",
    city: "Bogota",
    image: ""
  });

  // async function party(params) {
  //   const [geoHash, ghBounds] = await fetchUserLongLat();
  //   const req = await fetch('url', {
  //                     Method: 'POST',
  //                     Headers: {
  //                       Accept: 'application.json',
  //                       'Content-Type': 'application/json'
  //                     },
  //                     Body: {geoHash: geoHash, ghBounds: ghBounds},
  //                     Cache: 'default'
  //                   })
  // }



  async function prove(geoHash, userHash) {
    const acirHex =
    "cd92bd0dc230108595bf3d32822fb6937307120d2d1b24e1022e481159e9bd411c174c00126cc4365040913a2eb8eaaa277ddf7b3ebbdadba1ee4f3447f9ef8b73fbdc0eda9c2f6474eb273fbf366cdd41f4c9e0ac1482aa828043cd0ad5a064423625028244792c90734281956a54c514084ed049c5bb6f481c2023598dc2ec63a7076a8d1ec9def7fd4883999374a1ccf9f5c692d405e0cd02f00627cbdc9f34b998b90b30f300baa737";
    const NoirJs = await Noir.new();

    const res = await NoirJs.createProof(acirHex, [geoHash.toString("hex"), userHash.toString("hex")], 32);
    const verified = await NoirJs.verifyProof(res.verifier, res.proof);
    console.log("proof verification", verified);
    console.log(res);

}



  async function noirToIPFS() {
    const privKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGIzZjNjMWM0ZjMxOTNmODI4ODlEZTZBMmVjRjAxMmQwQ0VjRjQ4NUYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc5OTYxODUzNDUsIm5hbWUiOiJGUy1IQUNLIn0.zi3M741ubRNKN5n5YumSenNZmqR8ToHtQi4idlmKOHY";
    const storage = new Web3Storage( {token:privKey} )
    const [geoHash, ghBounds] = await fetchUserLongLat();
    const proof = await prove(geoHash, geoHash);

    const blob = new Blob([JSON.stringify({...formInput, proof: proof, imageFile: "test"})], { type: 'application/json' })
    const finalFile = [new File([blob], 'hello.json')]

    const cid = await storage.put(finalFile);
    console.log('Content added with CID:', cid)
  }


  async function fetchUserLongLat() {
      const userIP = await publicIpv4();
      console.log(userIP)
      const res = await fetch(`https://get.geojs.io/v1/ip/geo/${userIP}.json`);
      const obj = await res.json();
      const longLat = {lat:parseFloat(obj.latitude),
        lng: parseFloat(obj.longitude)};
      const geohash = Geohash.encode(longLat.lat, longLat.lng, 4);
      console.log(Geohash.bounds(geohash));
    return [geohash, Geohash.bounds(geohash)];
  }


  // const navigate = useNavigate();

  // async function metadataNFT() {
  //   const NFT_STORAGE_TOKEN =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGM4ZkIzMjREYmRBM0E3ZEI4NzcxNWZiODMwQzcwN0Q1OUU5RGZCREEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1ODU3Mzc3NjU2NiwibmFtZSI6IlRpY2tldFBsYXRmb3JtIn0.VbIeku0jvn2FnjuqGBvAImyp5ziQt4duXUgA4kDhTpA";
  //   const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  //   let jsonObject = {
  //     name: formInput.name,
  //     datetime: formInput.datetime,
  //     city: formInput.city,
  //     description: formInput.description,
  //     supply: formInput.supply,
  //     price: formInput.price,
  //     imgUrl: fileUrl
  //   };

  //   jsonObject = new File([JSON.stringify(jsonObject)], "metadata.json", {
  //     type: "text/json",
  //   });

  //   const metadata = await client.storeDirectory([jsonObject]);
  //   return metadata;
  // }

  async function onChange(e) {
    const file = e.target.files[0];
    console.log(file);
    try {

    } catch (e) {
      console.log(e);
    }
  }

  // const createEvent = async (uri) => {
  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();

  //   const price = ethers.utils.parseUnits(formInput.price, "ether");
  //   console.log(price)
  //   let contract = new ethers.Contract(factoryAddress, Factory.abi, signer);
  //   const newEvent = await contract.createEvent(formInput.supply, price, uri);
  //   navigate("/");
  // };

  return (

    <Container maxW='2xl' bg='blue.600' >
      <Heading as='h2' size='2xl'>
        Spread your Truth
      </Heading>
      <FormLabel >Image name</FormLabel>
      <Input
        value={formInput.name}
        onChange={(event) =>
          setFormInput({ ...formInput, name: event.target.value })
        }
        id="name"
      />
      <FormLabel>Location</FormLabel>
      <Input
        value={formInput.city}
        onChange={(event) =>
          setFormInput({ ...formInput, city: event.target.value })
        }
      ></Input>
      <FormLabel>Image Description</FormLabel>
      <Textarea
        value={formInput.description}
        onChange={(event) =>
          setFormInput({ ...formInput, description: event.target.value })
        }
        id="description"
      />

      <FormLabel>Image</FormLabel>
      <Input type="file" name="Asset" onChange={onChange} />
      {fileUrl && <Image src={fileUrl} maxW="250px" />}
      <Image
    boxSize='150px'
    objectFit='cover'
    src='https://bit.ly/dan-abramov'
    alt='Dan Abramov'
  />
  <AspectRatio ratio={16 / 9}>
  <iframe
    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414770757!3d6.5276316452784755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1567723392506!5m2!1sen!2sng'
  />
</AspectRatio>
      <Box textAlign="center" mt={10}>
        <Button
          colorScheme='teal'
          size='md'
          onClick={async () => {
            noirToIPFS();
          }}
        >
          If you agree, to the above location range get your proof & image posted!
        </Button>
      </Box>
    </Container>
  );
};

