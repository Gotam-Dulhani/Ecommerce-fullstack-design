"use client";

import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  deleteAllProducts,
  fetchAllProducts,
  type Product,
  type ProductInput,
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
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await fetchAllProducts();
      setProducts(data);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = "checked" in target && typeof target.checked === "boolean" ? target.checked : false;
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : type === "checkbox" ? checked : value }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({ name: product.name, price: product.price, image: product.image, description: product.description, category: product.category, stock: product.stock, featured: product.featured ?? false });
    setSuccess(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setEditingId(null); setForm(emptyForm); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      if (editingId) { await updateProduct(editingId, form); setSuccess("Product updated!"); }
      else { await createProduct(form); setSuccess("Product created!"); }
      const data = await fetchAllProducts();
      setProducts(data);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    const replace = window.confirm("This will DELETE ALL existing products and seed 25 demo products. Continue?");
    if (!replace) return;
    setError(null);
    setSuccess(null);
    setSeeding(true);
    try {
      await deleteAllProducts();
      for (const p of SEED_PRODUCTS) { await createProduct(p); }
      const data = await fetchAllProducts();
      setProducts(data);
      setSuccess(`Seeded ${SEED_PRODUCTS.length} demo products!`);
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
    setSuccess("Product deleted.");
  };

  function updateProduct(id: string, updates: Partial<ProductInput>) {
    return import("../../lib/products").then((m) => m.updateProduct(id, updates));
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-12 md:px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500"><div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" /> Checking permissions...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-12 md:px-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Admin access required</h1>
          <p className="mt-2 max-w-sm mx-auto text-sm text-slate-500">
            Set <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">NEXT_PUBLIC_ADMIN_EMAIL</code> in your environment variables to your email address, then redeploy.
          </p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(products.map((p) => p.category))].sort();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Product management</h1>
          <p className="mt-1 text-sm text-slate-500">{products.length} product{products.length !== 1 ? "s" : ""} in your store</p>
        </div>
        <button
          type="button"
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          {seeding ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" /> Seeding...</>
          ) : (
            <><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg> Seed demo products</>
          )}
        </button>
      </div>

      {success && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          <p className="text-xs text-emerald-700">{success}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-sm font-bold text-slate-900">{editingId ? "Edit product" : "Add new product"}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Name</label>
              <input name="name" type="text" required value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
              <input name="category" type="text" required value={form.category} onChange={handleChange} list="categories-list" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              <datalist id="categories-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Price ($)</label>
                <input name="price" type="number" min={0} step="0.01" required value={form.price} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Stock</label>
                <input name="stock" type="number" min={0} required value={form.stock} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input name="featured" type="checkbox" checked={form.featured ?? false} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label className="text-xs font-semibold text-slate-700">Mark as featured</label>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Image URL</label>
              <input name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://..." className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              {form.image && (
                <div className="mt-2 h-20 w-20 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  <img src={form.image} alt="Preview" className="block" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Description</label>
              <textarea name="description" required value={form.description} onChange={handleChange} rows={3} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
            {saving ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update product" : "Add product")}
          </button>
          {editingId && <button type="button" onClick={handleCancel} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>}
        </div>
      </form>

      {/* Product list */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-900">All products</h2>
        </div>
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">No products yet. Add one above or seed the demo catalog.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 px-5 py-3 transition hover:bg-slate-50/50">
                <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:block">
                  {product.image ? <img src={product.image} alt={product.name} className="block" style={{ height: "100%", width: "100%", objectFit: "cover" }} /> : <div className="h-full w-full bg-slate-100" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">
                    {product.category} &middot; ${product.price.toFixed(2)} &middot; Stock: {product.stock}
                    {product.featured && <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Featured</span>}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => handleEdit(product)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">Edit</button>
                  <button type="button" onClick={() => void handleDelete(product.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
