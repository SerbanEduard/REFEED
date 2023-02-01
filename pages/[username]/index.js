import { getUserWithUsername } from 'import/lib/firebase';
import React from 'react'

export async function getServerSideProps({ query }){
  const { username } = query;

  const userDoc = await getUserWithUsername(username);
  let user = userDoc.data();
  console.log(user.displayName);

  return {
    props: { username, user },
  };
}

export default function index({username, user}) {

  return (
    <>
      <div>{username}</div>
      <div>{user.displayName}</div>
      <div>{user.photoURL}</div>
      <div>omgomgomgomg</div>
    </>
  );
}
