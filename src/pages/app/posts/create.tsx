import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Layout from "../../../components/Layout";

type RequestData = {
  id?: string;
  title: string;
  content: string;
};

export default function IndexPage() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();

  async function handleSavePost(event: FormEvent) {
    event.preventDefault();

    let data: RequestData = {
      content,
      title
    };

    let method = "POST";

    if (id) {
      method = "PUT";
      data.id = id;
    }

    try {
      await fetch("http://localhost:3000/api/posts", {
        method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });

      router.push("/app");

      setContent("");
      setTitle("");
      setId("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Layout title="New Post">
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
                  Criar
                </button>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
