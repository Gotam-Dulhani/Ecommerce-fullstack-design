"use client";

import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  deleteAllProducts,
  fetchAllProducts,
  type Product,
  type ProductInput,
  updateProduct,
} from "../../lib/products";
import { useAuth } from "../../context/AuthContext";
import { SEED_PRODUCTS } from "../../lib/seedCatalog";

const emptyForm: ProductInput = {
  name: "",
  price: 0,
  image: "",
  description: "",
  category: "",
  stock: 0,
  featured: false,
};

export default function AdminPage() {
  const { isAdmin, user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    void (async () => {
      const data = await fetchAllProducts();
      setProducts(data);
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked =
      "checked" in target && typeof target.checked === "boolean"
        ? target.checked
        : false;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      stock: product.stock,
      featured: product.featured ?? false,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      const data = await fetchAllProducts();
      setProducts(data);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    const replace = window.confirm(
      "This will DELETE ALL existing products and seed a demo catalog. Continue?",
    );
    if (!replace) return;

    setError(null);
    setSeeding(true);
    try {
      await deleteAllProducts();
      for (const p of SEED_PRODUCTS) {
        await createProduct(p);
      }
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed products.");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-6">
        <p className="text-sm text-zinc-500">Checking permissions...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-8 md:px-6">
        <h1 className="text-xl font-semibold text-zinc-900">
          Admin access required
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          You must be signed in with an admin account to manage products.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 md:px-6 md:pt-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
        Product management
      </h1>
      <p className="mt-1 text-sm text-zinc-600">
        Create, edit, and delete products in your store.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void handleSeed()}
          disabled={seeding}
          className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-60 md:text-sm"
        >
          {seeding ? "Seeding demo products..." : "Seed demo products"}
        </button>
        <p className="text-xs text-zinc-500">
          Adds a ready-to-use catalog with images and categories.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm shadow-zinc-100 md:grid-cols-2 md:gap-5 md:p-6"
      >
        <div className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="text-xs font-medium text-zinc-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="text-xs font-medium text-zinc-700"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="price"
                className="text-xs font-medium text-zinc-700"
              >
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step="0.01"
                required
                value={form.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
              />
            </div>
            <div>
              <label
                htmlFor="stock"
                className="text-xs font-medium text-zinc-700"
              >
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min={0}
                required
                value={form.stock}
                onChange={handleChange}
                className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={form.featured ?? false}
              onChange={handleChange}
              className="h-3 w-3 rounded border-zinc-300 text-black focus:ring-0"
            />
            <label
              htmlFor="featured"
              className="text-xs font-medium text-zinc-700"
            >
              Mark as featured
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="image"
              className="text-xs font-medium text-zinc-700"
            >
              Image URL (optional)
            </label>
            <input
              id="image"
              name="image"
              type="text"
              value={form.image}
              onChange={handleChange}
              className="mt-1 w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="text-xs font-medium text-zinc-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-800"
            />
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-full bg-black px-4 py-2 text-xs font-medium text-white hover:bg-zinc-900 disabled:opacity-60 md:text-sm"
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                  ? "Update product"
                  : "Add product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-zinc-500 hover:text-zinc-900 md:text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-8 space-y-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm shadow-zinc-100 md:p-6">
        <h2 className="text-sm font-semibold text-zinc-900 md:text-base">
          Existing products
        </h2>
        {products.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No products yet. Use the form above to add your first product.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100 text-sm">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900">{product.name}</p>
                  <p className="text-xs text-zinc-500">
                    {product.category} · ${product.price.toFixed(2)} · Stock:{" "}
                    {product.stock}{" "}
                    {product.featured && (
                      <span className="ml-1 rounded-full bg-amber-100 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                        Featured
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="text-xs text-zinc-600 hover:text-zinc-900"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(product.id)}
                    className="text-xs text-rose-500 hover:text-rose-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


