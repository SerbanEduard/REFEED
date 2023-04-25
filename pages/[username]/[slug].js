import { collection, collectionGroup, getDoc, where, getDocs, query, doc } from 'firebase/firestore';
import PostContent from 'import/components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from 'import/lib/firebase';
import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore';
import styles from '../../styles/Post.module.css';


export async function getStaticProps({ params }) {
    const {username, slug} = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if(userDoc) {
        const ref = collection(firestore, 'users', userDoc.id, 'posts');
        const postRef = query(ref, where('slug', '==', slug));
        post = postToJSON(await getDocs(postRef));

        path = ref.path;
    }

    return {
        props: {post, path, slug},
        revalidate: 5000,
    }

}

export async function getStaticPaths() {
    const posts = await getDocs(query(collectionGroup(firestore, 'posts')));
    const paths = [];
    let i = 0;
    posts.forEach((doc) => {
        const { slug, username} = doc.data();
        paths[i++] = {params: {username, slug}}
    });

    return {
        paths,
        fallback: 'blocking',
    };

}



export default function Post(props) {
    const postRef = doc(firestore, `${props.path}/${props.slug}`)
    const [realtimePost] = useDocumentData(postRef);
  
    const post = realtimePost || props.post;
  
    return (
      <main className={styles.container}>
  
        <section>
          <PostContent post={post} />
        </section>
  
        <aside className="card">
          <p>
            <strong>{post.heartCount || 0} 🤍</strong>
          </p>
  
        </aside>
      </main>
    );

}
