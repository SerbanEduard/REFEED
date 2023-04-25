import { collectionGroup, limit, query, where, getDocs, startAfter, orderBy, Timestamp} from "firebase/firestore";
import PostFeed from "import/components/PostFeed";
import { useState } from "react";
import { firestore, textToJSON } from 'import/lib/firebase';
import Loader from "import/components/Loader";


const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = query(collectionGroup(firestore, 'posts'), where('published', '==', true),orderBy('createdAt', 'desc'), limit(LIMIT));

  const postsArray = [];
  const posts = await getDocs(postsQuery)
  let i = 0;
  posts.forEach((doc) => {
    postsArray[i++] = textToJSON(doc);
  })

  return {
    props: { postsArray },
  };
}


export default function Home(props) {
  const [posts, setPosts] = useState(props.postsArray);
  const [loading, setLoading] = useState(false);

  const[postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

    const q = query(collectionGroup(firestore, 'posts'), where('published', '==', true),orderBy('createdAt', 'desc'), startAfter(cursor), limit(LIMIT))

    const newPostsArray = [];
    const posts1 = await getDocs(q);
    let i = 0;
    posts1.forEach((doc) => {
      newPostsArray[i++] = textToJSON(doc);
    })

    setPosts(posts.concat(newPostsArray));
    setLoading(false);

    if(newPostsArray.length < LIMIT) {
      setPostsEnd(true);
    }
  }



  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  )
}
