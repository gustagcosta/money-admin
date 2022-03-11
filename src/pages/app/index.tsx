import { Post } from "@prisma/client";
import { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { prisma } from "../../lib/prisma";

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();

  useEffect(() => {
    getAllPosts();
  }, []);

  async function getAllPosts() {
    const response = await fetch("http://localhost:3000/api/posts");
    const posts = await response.json();
    setPosts(posts);
  }

  async function handleSignOut() {
    const data = await signOut({ redirect: false, callbackUrl: "/" });

    router.push(data.url);
  }

  async function handleSavePost(event: FormEvent) {
    event.preventDefault();

    await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    getAllPosts();
    setContent("");
    setTitle("");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            MVP NEXT JS PRISMA
          </a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link cursor-pointer"
                  style={{ cursor: "pointer" }}
                  onClick={handleSignOut}>
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
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
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite a sua história"
                />
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-primary">
                  Enviar
                </button>
              </div>
            </div>
          </form>
          <div>
            <div className="list-group">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="list-group-item flex-column align-items-start">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{p.title}</h5>
                    <small>
                      Criado em: {new Date(p.createdAt).toLocaleDateString()} /{" "}
                      Atualizado em: {new Date(p.updatedAt).toLocaleString()}
                    </small>
                  </div>
                  <p className="mb-1">{p.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
