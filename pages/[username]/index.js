import { getDocs, limit, where, query, collectionGroup, orderBy, } from 'firebase/firestore';
import PostFeed from 'import/components/PostFeed';
import UserProfile from 'import/components/UserProfile';
import { firestore, getUserWithUsername, textToJSON } from 'import/lib/firebase';
import React from 'react'

export async function getServerSideProps({ params }){
  const { username } = params;

  const postsArray = [];
  let user = null;
  let posts = null;

  const userDoc = await getUserWithUsername(username);
  if(userDoc){
    user = userDoc.data();
    const postsRef = collectionGroup(firestore, 'posts');
    const q = query(postsRef, where('published', '==', true), where('username', '==', username),orderBy('createdAt', 'desc'),
      limit(5));
    posts = await getDocs(q)
    let i = 0;
    posts.forEach((doc) => {
      postsArray[i++] = textToJSON(doc);
    })
    }

  return {
    props: { user, postsArray },
  };
}

export default function index({user, postsArray}) {
  
  return (
    <main>
      <UserProfile user={ user } />
      <PostFeed posts={ postsArray } />
    </main>
  );
}
