"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function deleteTemplate(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.timerTemplate.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/app/templates");
}

export async function createTemplate(data: {
  name: string;
  description?: string;
  mode: string;
  config: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const isPro = (session.user as { isPro?: boolean }).isPro ?? false;

  if (!isPro) {
    const count = await db.timerTemplate.count({
      where: { userId: session.user.id },
    });
    if (count >= 3) {
      throw new Error("Free plan limit reached. Upgrade to Pro for unlimited templates.");
    }
  }

  const template = await db.timerTemplate.create({
    data: {
      userId: session.user.id,
      name: data.name,
      description: data.description,
      mode: data.mode,
      config: data.config,
    },
  });

  revalidatePath("/app/templates");
  return template;
}
