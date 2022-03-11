import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      const { title, content } = req.body;

      await prisma.post.create({ data: { content, title } });

      return res.status(201).json({});
    case "GET":
      const posts = await prisma.post.findMany();

      // const data = posts.map((p) => {
      //   return {
      //     id: p.id,
      //     title: p.title,
      //     content: p.content,
      //     createdAt: p.createdAt.toISOString(),
      //     updatedAt: p.updatedAt.toISOString()
      //   };
      // });

      return res.status(200).json(posts);
    default:
      return res.status(404).json({});
  }
}
