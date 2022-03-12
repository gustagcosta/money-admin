import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Layout from "../../../../components/Layout";
import ErrorLayout from "../../../../components/ErrorLayout";
import { prisma } from "../../../../lib/prisma";

type RequestData = {
  id?: string;
  title: string;
  content: string;
};

type PostWithoutDates = {
  id: string;
  content: string;
  title: string;
};

type IndexPageProps = {
  post?: PostWithoutDates;
  notfound: boolean;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findFirst({
    where: { id: String(params.id) }
  });

  if (!post) {
    return {
      props: {
        notfound: true
      }
    };
  }

  return {
    props: {
      post: {
        id: post.id,
        title: post.title,
        content: post.content
      },
      notfound: false
    }
  };
};

export default function IndexPage({ post, notfound }: IndexPageProps) {
  if (notfound) {
    return <ErrorLayout />;
  }

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const router = useRouter();
  const { id } = router.query;

  async function handleSavePost(event: FormEvent) {
    event.preventDefault();

    let data: RequestData = {
      content,
      title,
      id: String(id)
    };

    try {
      await fetch("http://localhost:3000/api/posts", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });

      router.push("/app");
    } catch (error) {
      // TODO improve error handler
      console.log(error);
    }
  }

  async function handleDelete() {
    try {
      await fetch("http://localhost:3000/api/posts", {
        method: "DELETE",
        body: JSON.stringify({ id: String(id) }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      router.push("/app");
    } catch (error) {
      // TODO improve error handler
      console.log(error);
    }
  }

  return (
    <>
      <Layout title="Post Update">
        <div>
          <form onSubmit={handleSavePost}>
            <div className="row mt-3">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  Conteúdo
                </label>
                <textarea
                  id="content"
                  className="form-control"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite a sua história"
                />
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-primary">
                  Editar
                </button>
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{ cursor: "pointer" }}
                  onClick={handleDelete}
                  className="btn btn-danger">
                  Deletar
                </div>
                &nbsp;&nbsp;&nbsp;
                <Link href={`/app/posts/${post.id}`}>
                  <a className="btn btn-secondary">Voltar</a>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
