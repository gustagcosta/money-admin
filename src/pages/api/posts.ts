import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function Api (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, content } = req.body;

    await prisma.post.create({ data: { content, title } });

    return res.status(201).json({});
  }

  if (req.method === "GET") {
    const posts = await prisma.post.findMany();

    return res.status(200).json(posts);
  }

  if (req.method === "PUT") {
    const { id, title, content } = req.body;

    await prisma.post.update({ data: { title, content }, where: { id } });

    return res.status(200).json({});
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    await prisma.post.delete({ where: { id } });

    return res.status(200).json({});
  }

  return res.status(404).json({});
}
