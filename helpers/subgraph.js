const SUBGRAPH = "https://api.thegraph.com/subgraphs/name/richwarner/trustapp"
import { createClient } from "urql"

export const getMediaPosts = async () => {
    const query = `{
      mediaPosts(
        where: {dataUri_contains: "http"}
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        owner
        timestamp
        dataUri
      }
    }`

    const client = createClient({
        url: SUBGRAPH
    })

    const response = await client.query(query).toPromise()

    return response.data.mediaPosts
}
