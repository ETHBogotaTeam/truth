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
  InputGroup,
} from "@chakra-ui/react";


const App = () => {
  const [fileUrl, setFileUrl] = useState("");
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
    datetime: "",
    city: "",
    venue: "",
    price: "",
    supply: "",
  });

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
    <Container>
      <Heading as="h3" size="md">
        Spread your Truth
      </Heading>
      <FormLabel>Image name</FormLabel>
      <Input
        value={formInput.name}
        onChange={(event) =>
          setFormInput({ ...formInput, name: event.target.value })
        }
        id="name"
      />
      <FormLabel>Date and Time</FormLabel>
      <Input
        placeHolder="Select Date and Time"
        size="md"
        backgroundColor="#ffffff"
        type="datetime-local"
        id="datetime"
        onChange={(event) =>
          setFormInput({ ...formInput, datetime: event.target.value })
        }
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

      <FormLabel>Event Image</FormLabel>
      <Input type="file" name="Asset" onChange={onChange} />
      {fileUrl && <Image src={fileUrl} maxW="250px" />}
      <Box textAlign="center" mt={10}>
        <Button
          size="lg"
          colorScheme="blue"
          onClick={async () => {
            const metadata = await metadataNFT();
            createEvent("ipfs://" + metadata);
          }}
        >
          Spread the Truth!
        </Button>
      </Box>
    </Container>
  );
};

export default App;
