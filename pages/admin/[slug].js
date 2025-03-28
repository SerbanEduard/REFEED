import { doc, updateDoc } from "firebase/firestore";
import AuthCheck from "import/components/AuthCheck";
import { auth, firestore } from "import/lib/firebase";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styles from '../../styles/Admin.module.css';
import { useForm } from "react-hook-form";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { ErrorMessage } from "@hookform/error-message";

export default function AdminSlug() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}


function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(firestore, `users/${auth.currentUser.uid}/posts/${slug}`);
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({defaultValues, mode: 'onChange' });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
    })

    reset({ content, published });

    toast.success("Update Done!");
  }


  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <textarea {...register('content', {
          maxLength: {value: 20000, message: 'content is too long' },
          minLength: {value: 10, message: 'content is too short' }
        })}></textarea>


        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        
        <fieldset>
          <input className={styles.checkbox} type="checkbox" {...register('published')} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}
