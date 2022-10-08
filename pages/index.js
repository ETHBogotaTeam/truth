import Head from "next/head"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Lens } from "../helpers/lens"
import { LENS_API_URL } from "../config/mumbai"

export default function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        const lens = new Lens(LENS_API_URL)

        try {
            const posts = await lens.getPosts()
            console.log("POST DATA: ", posts)
        } catch (err) {
            console.log("Error fetching post data: ", err)
        }
    }

    return (
        <div>
            <Head>
                <title>Truth</title>
                <meta name="description" content="Truth App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>Truth</h1>
            </main>

            <footer>Powered by Truth</footer>
        </div>
    )
}
