// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import  noirToIPFS  from "../../utils/noirToIPFS";

export default async function (req, res) {
  const slug = req.query;
  console.log(slug)
  try {
    console.log(req);
    const answer = await noirToIPFS("hi", "hi");

    res.json({ answer });
  } catch (e) {
    console.log(e)
    res.status(400).json({ error: e.message, req: req });
  }
}
