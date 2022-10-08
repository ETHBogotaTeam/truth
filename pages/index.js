import Head from "next/head"
import Image from "next/image"
import Link from "next/Link"
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
            setPosts(posts)
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
                {posts.map((post, index) => (
                    <Link
                        href={`/profile/${
                            post.profile.id || post.profile.profileId
                        }`}
                        key={index}
                    >
                        <a>
                            <div>
                                {/* <p>{typeMap[post.__typename]}</p> */}
                                <div>
                                    {post.profile.picture &&
                                    post.profile.picture.original ? (
                                        <img
                                            src={
                                                post.profile.picture.original
                                                    .url
                                            }
                                        />
                                    ) : (
                                        <div />
                                    )}

                                    <div>
                                        <h3>{post.profile.name}</h3>
                                        <p>{post.profile.handle}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>{post.metadata.content}</p>
                                </div>
                            </div>
                        </a>
                    </Link>
                ))}
            </main>

            <footer>Powered by Truth</footer>
        </div>
    )
}
