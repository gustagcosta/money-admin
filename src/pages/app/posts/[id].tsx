import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Layout from "../../../components/Layout";
import ErrorLayout from "../../../components/ErrorLayout";
import { prisma } from "../../../lib/prisma";

type RequestData = {
  id?: string;
  title: string;
  content: string;
};

type PostWithoutDates = {
  id: string;
  content: string;
  title: string;
  createdAt: string;
  updatedAt: string;
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
        content: post.content,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      },
      notfound: false
    }
  };
};

export default function PostDetailsPage({ post, notfound }: IndexPageProps) {
  if (notfound) {
    return <ErrorLayout />;
  }

  return (
    <>
      <Layout title="Post Update">
        <div className="container card">
          <h1 className="text-center">{post.title}</h1>
          <div>Criado em: {new Date(post.createdAt).toLocaleDateString()}</div>
          <div>Editado em: {new Date(post.createdAt).toLocaleDateString()}</div>
          <br />
          <p>{post.content}</p>
          <div>
            <Link href={`/app/posts/edit/${post.id}`}>
              <a className="btn btn-primary mb-3">Atualizar</a>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
