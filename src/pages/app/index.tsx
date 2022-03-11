import { Post } from "@prisma/client";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

type RequestData = {
  id?: string;
  title: string;
  content: string;
};

export default function IndexPage () {
  const [posts, setPosts] = useState<Post[]>([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getAllPosts();
  }, []);

  async function getAllPosts() {
    const response = await fetch("http://localhost:3000/api/posts");
    const posts = await response.json();
    setPosts(posts);
  }

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

    await fetch("http://localhost:3000/api/posts", {
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    getAllPosts();
    setContent("");
    setTitle("");
    setId("");
  }

  function handlePrepareEdit(post: Post) {
    setContent(post.content);
    setTitle(post.title);
    setId(post.id);
  }

  async function handleDelete() {
    await fetch("http://localhost:3000/api/posts", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    getAllPosts();
    setContent("");
    setTitle("");
    setId("");
  }

  function clearState() {
    setContent("");
    setTitle("");
    setId("");
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="container">
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
                  {id ? "Editar" : "Criar"}
                </button>
                &nbsp;&nbsp;&nbsp;
                {id && (
                  <>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={handleDelete}
                      className="btn btn-danger">
                      Deletar
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={clearState}
                      className="btn btn-secondary">
                      Cancelar
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
          <div>
            <div className="list-group">
              {posts.map((p) => {
                const createdAt = new Date(p.createdAt).toLocaleDateString();
                const updatedAt = new Date(p.updatedAt).toLocaleDateString();
                return (
                  <div
                    key={p.id}
                    className="list-group-item flex-column align-items-start"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePrepareEdit(p)}>
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{p.title}</h5>
                      <small>
                        Criado em: {createdAt} - Atualizado em: {updatedAt}
                      </small>
                    </div>
                    <p className="mb-1">{p.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
