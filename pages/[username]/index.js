import { collection, getDocs, limit, orderBy, where } from 'firebase/firestore';
import { firestore, getUserWithUsername, textToJSON } from 'import/lib/firebase';
import React from 'react'

export async function getServerSideProps({ query }){
  const { username } = query;

  let user = null;
  let posts = null;

  const userDoc = await getUserWithUsername(username);
  if(userDoc){
    user = userDoc.data();
    const postsRef = collection(firestore, 'posts');
    const q = query(postsRef, where('published', '===', true), 
      orderBy('createdAt', 'desc'),
      limit(5));
    posts = (await getDocs(q).map(textToJSON))
  }
  console.log(user.displayName);

  return {
    props: { user, posts },
  };
}

export default function index({username, user}) {

  return (
    <main>
      <UserProfile user={ user } />
    </main>
  );
}
