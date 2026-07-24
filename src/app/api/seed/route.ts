import { NextResponse } from "next/server";
import { ref, set, get, push } from "firebase/database";
import { getFirebaseDb } from "../../../lib/firebase";
import { SEED_PRODUCTS, SEED_VERSION } from "../../../lib/seedCatalog";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const db = getFirebaseDb();
    const productsRef = ref(db, "products");

    const url = new URL(request.url);
    const force = url.searchParams.get("force") === "true";

    const snapshot = await get(productsRef);

    if (snapshot.exists() && !force) {
      const data = snapshot.val() as Record<string, { image?: string; seedVersion?: string }>;
      const values = Object.values(data);
      const missingImages = values.some((p) => !p.image);
      const hasCurrentVersion = values.every((p) => p.seedVersion === SEED_VERSION);

      if (!missingImages && hasCurrentVersion) {
        return NextResponse.json({
          seeded: false,
          message: "Products already exist with current version. Skipping seed.",
          count: snapshot.size ?? values.length,
        });
      }
    }

    const seedData: Record<string, (typeof SEED_PRODUCTS)[number] & { seedVersion: string }> = {};
    for (const product of SEED_PRODUCTS) {
      const key = push(productsRef).key!;
      seedData[key] = { ...product, seedVersion: SEED_VERSION };
    }

    await set(productsRef, seedData);

    return NextResponse.json({
      seeded: true,
      version: SEED_VERSION,
      message: `Successfully seeded ${SEED_PRODUCTS.length} products (v${SEED_VERSION}).`,
      count: SEED_PRODUCTS.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to seed products.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
