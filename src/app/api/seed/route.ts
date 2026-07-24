import { NextResponse } from "next/server";
import { ref, set, get, push } from "firebase/database";
import { getFirebaseDb } from "../../../lib/firebase";
import { SEED_PRODUCTS } from "../../../lib/seedCatalog";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const db = getFirebaseDb();
    const productsRef = ref(db, "products");

    const url = new URL(request.url);
    const force = url.searchParams.get("force") === "true";

    const snapshot = await get(productsRef);

    if (snapshot.exists() && !force) {
      const data = snapshot.val() as Record<string, { image?: string }>;
      const missingImages = Object.values(data).some((p) => !p.image);
      if (!missingImages) {
        return NextResponse.json({
          seeded: false,
          message: "Products already exist. Skipping seed.",
          count: snapshot.size ?? Object.keys(snapshot.val() ?? {}).length,
        });
      }
    }

    const seedData: Record<string, (typeof SEED_PRODUCTS)[number]> = {};
    for (const product of SEED_PRODUCTS) {
      const key = push(productsRef).key!;
      seedData[key] = product;
    }

    await set(productsRef, seedData);

    return NextResponse.json({
      seeded: true,
      message: `Successfully seeded ${SEED_PRODUCTS.length} products.`,
      count: SEED_PRODUCTS.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to seed products.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
