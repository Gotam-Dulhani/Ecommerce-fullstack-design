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
import { Lock, RefreshCw, Trash2, Pencil } from "lucide-react";
import { formatPrice } from "../../lib/utils";

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
      <div className="mx-auto max-w-5xl px-4 pt-12 md:px-6 pt-24">
        <div className="flex items-center gap-2 text-sm text-zinc-500"><div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-[var(--gold)]" /> Checking permissions...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-12 md:px-6 pt-24">
        <div className="rounded-xl border border-white/5 bg-[var(--surface)] p-8 text-center">
          <Lock className="mx-auto h-12 w-12 text-zinc-700" />
          <h1 className="mt-4 text-xl font-bold text-white">Admin access required</h1>
          <p className="mt-2 max-w-sm mx-auto text-sm text-zinc-500">
            Set <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-mono text-[var(--gold)]">NEXT_PUBLIC_ADMIN_EMAIL</code> in your environment variables to your email address, then redeploy.
          </p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 pt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">Product management</h1>
          <p className="mt-1 text-sm text-zinc-500">{products.length} product{products.length !== 1 ? "s" : ""} in your store</p>
        </div>
        <button
          type="button"
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
        >
          {seeding ? (
            <><RefreshCw className="h-4 w-4 animate-spin" /> Seeding...</>
          ) : (
            <><RefreshCw className="h-4 w-4" /> Seed demo products</>
          )}
        </button>
      </div>

      {success && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
          <p className="text-xs text-emerald-500">{success}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-white/5 bg-[var(--surface)] p-5 md:p-6">
        <h2 className="text-sm font-bold text-white">{editingId ? "Edit product" : "Add new product"}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-400">Name</label>
              <input name="name" type="text" required value={form.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-400">Category</label>
              <input name="category" type="text" required value={form.category} onChange={handleChange} list="categories-list" className={inputClass} />
              <datalist id="categories-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">Price ($)</label>
                <input name="price" type="number" min={0} step="0.01" required value={form.price} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">Stock</label>
                <input name="stock" type="number" min={0} required value={form.stock} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input name="featured" type="checkbox" checked={form.featured ?? false} onChange={handleChange} className="h-4 w-4 rounded border-zinc-700 bg-white/5 text-[var(--gold)] focus:ring-[var(--gold)]" />
              <label className="text-xs font-semibold text-zinc-400">Mark as featured</label>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-400">Image URL</label>
              <input name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://..." className={inputClass} />
              {form.image && (
                <div className="mt-2 h-20 w-20 overflow-hidden rounded-xl border border-white/5 bg-[var(--surface-elevated)]">
                  <img src={form.image} alt="Preview" className="block" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-400">Description</label>
              <textarea name="description" required value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--gold-dim)] disabled:opacity-60">
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
            {saving ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update product" : "Add product")}
          </button>
          {editingId && <button type="button" onClick={handleCancel} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/10">Cancel</button>}
        </div>
      </form>

      {/* Product list */}
      <div className="mt-6 rounded-xl border border-white/5 bg-[var(--surface)]">
        <div className="border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-bold text-white">All products</h2>
        </div>
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-zinc-500">No products yet. Add one above or seed the demo catalog.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 px-5 py-3 transition hover:bg-white/[0.02]">
                <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-elevated)] sm:block">
                  {product.image ? <img src={product.image} alt={product.name} className="block" style={{ height: "100%", width: "100%", objectFit: "cover" }} /> : <div className="h-full w-full bg-[var(--surface)]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{product.name}</p>
                  <p className="text-xs text-zinc-500">
                    {product.category} · {formatPrice(product.price)} · Stock: {product.stock}
                    {product.featured && <span className="ml-1.5 inline-flex items-center rounded-full bg-[var(--gold)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--gold)]">Featured</span>}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => handleEdit(product)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"><Pencil className="inline h-3 w-3 mr-1" />Edit</button>
                  <button type="button" onClick={() => void handleDelete(product.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 hover:text-red-400"><Trash2 className="inline h-3 w-3 mr-1" />Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
