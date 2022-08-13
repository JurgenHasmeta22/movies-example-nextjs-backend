import { prisma } from "@prisma/client";

export const authenthicationService = {
  createToken: (id: number) => {
    //@ts-ignore
    const token = jwt.sign({ id: id }, process.env.MY_SECRET, {
      expiresIn: "3days",
    });

    return token;
  },

  getUserFromToken: async (token: string) => {
    //@ts-ignore
    const data = jwt.verify(token, process.env.MY_SECRET);

    // @ts-ignore
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: data.id },
    });

    return user;
  },
};
