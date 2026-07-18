import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Part, Order, Promotion, Category } from "@/types/types";

type Tab = "dashboard" | "inventory" | "orders" | "promotions" | "settings";

const partSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  oemNumber: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  comparePrice: z.string().optional(),
  stock: z.string().min(1, 'Stock is required'),
  categoryId: z.string().min(1, 'Select a category'),
})

type PartForm = z.infer<typeof partSchema>

const promoSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discount: z.number().positive(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().positive().optional(),
});
type PromoForm = z.infer<typeof promoSchema>;

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#0d1526",
  border: "1px solid #1a2744",
  borderRadius: 14,
};

const inputSt: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #1a2744",
  background: "#0a0f1e",
  color: "#f9fafb",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

const labelSt: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 6,
  display: "block",
};

const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg,#1d6fe8,#4d9fff)",
  color: "#fff",
  border: "none",
  padding: "9px 18px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const btnSecondary: React.CSSProperties = {
  background: "#1a2744",
  color: "#94a3b8",
  border: "1px solid #334155",
  padding: "9px 18px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelSt}>{label}</label>
      {children}
      {error && (
        <p style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "promotions", label: "Promotions", icon: Tag },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div style={{ margin: "10px", padding: "32px 16px" }}>
      {/* Header */}
      <div
        style={{ justifyContent: "space-between", gap: 12, marginBottom: 28 }}
      >
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#f9fafb" }}>
            Admin dashboard
          </h1>
          <p style={{ fontSize: 20, color: "#475569" }}>
            PriusParts.ge — manage inventory, orders and promotions
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 24,
          background: "#0a0f1e",
          border: "1px solid #1a2744",
          borderRadius: 12,
          padding: 4,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              background: tab === id ? "#1a2744" : "transparent",
              color: tab === id ? "#f9fafb" : "#475569",
              transition: "all 0.15s",
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <DashboardTab />}
      {tab === "inventory" && <InventoryTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "promotions" && <PromotionsTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardTab() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data;
    },
  });

  const CARDS = [
    {
      label: "Total orders",
      value: stats?.totalOrders ?? "—",
      icon: ShoppingBag,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
    },
    {
      label: "Revenue",
      value: stats?.revenue ? formatPrice(stats.revenue) : "—",
      icon: TrendingUp,
      color: "#22c55e",
      bg: "rgba(34,197,94,0.1)",
    },
    {
      label: "Low stock alerts",
      value: stats?.lowStock ?? "—",
      icon: AlertTriangle,
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
    },
    {
      label: "Active parts",
      value: stats?.totalParts ?? "—",
      icon: Package,
      color: "#4d9fff",
      bg: "rgba(212,56,13,0.1)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 12,
        }}
      >
        {CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ ...card, padding: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#f9fafb",
                marginBottom: 2,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 12, color: "#475569" }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card, padding: 20 }}>
        <h2
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#f9fafb",
            marginBottom: 6,
          }}
        >
          Quick start
        </h2>
        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
          Use the tabs above to manage Prius parts inventory, view and update
          orders, create discount promotions, and configure store settings.
        </p>
      </div>
    </div>
  );
}

// ─── Inventory ────────────────────────────────────────────────────────────────
function InventoryTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('')

  const { data: parts, isLoading } = useQuery<Part[]>({
    queryKey: ["admin-parts"],
    queryFn: async () => {
      const { data } = await api.get("/admin/parts");
      return data;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/products/categories");
      return Array.isArray(data) ? data : (data.data ?? []);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartForm>({
    resolver: zodResolver(partSchema),
  });

  const saveMutation = useMutation({
  mutationFn: async (data: PartForm) => {
    const price = parseFloat(data.price)
    const stock = parseInt(data.stock)
    const comparePrice = data.comparePrice ? parseFloat(data.comparePrice) : undefined

    if (isNaN(price) || price <= 0) throw new Error('Invalid price')
    if (isNaN(stock) || stock < 0) throw new Error('Invalid stock')

    const payload = {
      name: data.name,
      description: data.description,
      oemNumber: data.oemNumber,
      categoryId: data.categoryId,
      price,
      stock,
      comparePrice,
      images: imageUrl ? [imageUrl] : [],
    }

    if (editId) return api.put(`/admin/parts/${editId}`, payload)
    return api.post('/admin/parts', payload)
  },
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-parts'] })
    setShowForm(false)
    setEditId(null)
    setImageUrl('') 
    reset()
  },
})

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/parts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-parts"] }),
  });

  const filtered = (Array.isArray(parts) ? parts : []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const getInput = (name: string | number): React.CSSProperties => ({
    ...inputSt,
    borderColor:
      focusedField === name
        ? "#1d6fe8"
        : errors[name as keyof PartForm]
          ? "#ef4444"
          : "#1a2744",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#475569",
            }}
          />
          <input
            placeholder="Search parts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputSt, paddingLeft: 34 }}
          />
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            reset();
          }}
          style={{ ...btnPrimary, marginLeft: "auto" }}
        >
          {showForm ? (
            <>
              <X size={14} /> Cancel
            </>
          ) : (
            <>
              <Plus size={14} /> Add part
            </>
          )}
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div style={{ ...card, overflow: "hidden" }}>
          {/* Form header */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #1a2744",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(212,56,13,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={14} style={{ color: "#4d9fff" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#f9fafb" }}>
              {editId ? "Edit part" : "Add new Prius part"}
            </span>
          </div>

          <form
            onSubmit={handleSubmit((d) => saveMutation.mutate(d))}
            style={{ padding: 24 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {/* Part name — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Part name *" error={errors.name?.message}>
                  <input
                    {...register("name")}
                    placeholder="e.g. Bosch Front Brake Pad Set — Prius Gen 3"
                    style={getInput("name")}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                </Field>
              </div>

              {/* Description — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Description">
                  <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Describe this part — compatibility, specifications, brand…"
                    style={{ ...inputSt, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={() => setFocusedField("description")}
                    onBlur={() => setFocusedField(null)}
                  />
                </Field>
              </div>

              {/* OEM number */}
              <Field label="OEM number" error={errors.oemNumber?.message}>
                <input
                  {...register("oemNumber")}
                  placeholder="e.g. 04465-47080"
                  style={{ ...getInput("oemNumber"), fontFamily: "monospace" }}
                  onFocus={() => setFocusedField("oemNumber")}
                  onBlur={() => setFocusedField(null)}
                />
              </Field>

              {/* Category */}
              <Field label="Category *" error={errors.categoryId?.message}>
                <select
                  {...register("categoryId")}
                  style={{ ...getInput("categoryId"), cursor: "pointer" }}
                  onFocus={() => setFocusedField("categoryId")}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="">Select category…</option>
                  {Array.isArray(categories) &&
                    categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                </select>
              </Field>

              {/* Price */}
              <Field label="Price (GEL) *" error={errors.price?.message}>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#475569",
                      fontSize: 13,
                    }}
                  >
                    ₾
                  </span>
                  <input
                    {...register("price")}
                    type="number"
                    step="1"
                    placeholder="e.g 49.99"
                    style={{ ...getInput("price"), paddingLeft: 28 }}
                    onFocus={() => setFocusedField("price")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </Field>
              <Field label="Image URL">
  <input
    value={imageUrl}
    onChange={(e) => setImageUrl(e.target.value)}
    placeholder="https://example.com/image.jpg"
    style={inputSt}
  />
  {imageUrl && (
    <img src={imageUrl} alt="Preview"
      style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover' }}
      onError={(e) => (e.currentTarget.style.display = 'none')}
    />
  )}
</Field>
              {/* Compare price */}
              <Field label="Compare price — original (optional)">
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#475569",
                      fontSize: 13,
                    }}
                  >
                    ₾
                  </span>
                  <input
                    {...register("comparePrice")}
                    type="number"
                    step="0.01"
                    placeholder="64.99 (shows crossed out)"
                    style={{ ...getInput("comparePrice"), paddingLeft: 28 }}
                    onFocus={() => setFocusedField("comparePrice")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </Field>

              {/* Stock */}
              <Field label="Stock quantity *" error={errors.stock?.message}>
                <input
                  {...register("stock")}
                  type="number"
                  placeholder="0"
                  style={getInput("stock")}
                  onFocus={() => setFocusedField("stock")}
                  onBlur={() => setFocusedField(null)}
                />
              </Field>
            </div>

            {/* Form actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid #1a2744",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                style={btnSecondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                style={{
                  ...btnPrimary,
                  opacity: saveMutation.isPending ? 0.7 : 1,
                  boxShadow: "0 4px 16px rgba(212,56,13,0.3)",
                }}
              >
                {saveMutation.isPending
                  ? "Saving…"
                  : editId
                    ? "Update part"
                    : "+ Add part"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory table */}
      <div style={{ ...card, overflow: "hidden" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#0a0f1e" }}>
              {["Name", "Category", "Price", "Stock", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "center",
                    padding: "12px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                    borderBottom: "1px solid #1a2744",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} style={{ padding: "12px 16px" }}>
                    <div
                      style={{
                        height: 16,
                        background: "#1a2744",
                        borderRadius: 4,
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "48px 16px",
                    textAlign: "center",
                    color: "#475569",
                  }}
                >
                  <Package
                    size={32}
                    style={{ margin: "0 auto 8px", opacity: 0.3 }}
                  />
                  <div>No parts found</div>
                </td>
              </tr>
            ) : (
              filtered.map((part, i) => (
                <tr
                  key={part.id}
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid #1a2744",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "#0a0f1e")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      "transparent")
                  }
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 500, color: "#e2e8f0" }}>
                      {part.name}
                    </div>
                    {part.oemNumber && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#475569",
                          fontFamily: "monospace",
                          marginTop: 2,
                        }}
                      >
                        {part.oemNumber}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        background: "rgba(212,56,13,0.1)",
                        color: "#4d9fff",
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {part.category?.name}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 600,
                      color: "#4d9fff",
                    }}
                  >
                    {formatPrice(part.price)}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 500,
                        background:
                          part.stock === 0
                            ? "rgba(239,68,68,0.1)"
                            : part.stock <= 10
                              ? "rgba(249,115,22,0.1)"
                              : "rgba(34,197,94,0.1)",
                        color:
                          part.stock === 0
                            ? "#f87171"
                            : part.stock <= 10
                              ? "#fb923c"
                              : "#4ade80",
                      }}
                    >
                      {part.stock === 0
                        ? "Out of stock"
                        : `${part.stock} in stock`}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => {
                          setEditId(part.id);
                          setShowForm(true);
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 7,
                          border: "1px solid #1a2744",
                          background: "#1a2744",
                          color: "#94a3b8",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(part.id)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 7,
                          border: "1px solid rgba(239,68,68,0.2)",
                          background: "rgba(239,68,68,0.08)",
                          color: "#f87171",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────
function OrdersTab() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data } = useQuery<{ data: Order[]; total: number }>({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      const { data } = await api.get("/admin/orders", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      return data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const STATUS_OPTIONS = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  const STATUS_COLORS: Record<string, string> = {
    PENDING: "#f59e0b",
    PROCESSING: "#3b82f6",
    SHIPPED: "#8b5cf6",
    DELIVERED: "#22c55e",
    CANCELLED: "#ef4444",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Status filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
              transition: "all 0.15s",
              background: statusFilter === s ? "#1d6fe8" : "#1a2744",
              color: statusFilter === s ? "#fff" : "#64748b",
            }}
          >
            {s || "All orders"} {s === "" && data ? `(${data.total})` : ""}
          </button>
        ))}
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#0a0f1e" }}>
              {["Order", "Customer", "Total", "Status", "Date", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "center",
                    padding: "12px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                    borderBottom: "1px solid #1a2744",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.data.map((order, i) => {
              const isExpanded = expandedId === order.id;
              const statusColor = STATUS_COLORS[order.status] || "#64748b";
              return (
                <>
                  <tr
                    key={order.id}
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid #1a2744",
                    }}
                    onMouseEnter={(e) =>
                      ((
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = "#0a0f1e")
                    }
                    onMouseLeave={(e) =>
                      ((
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 600,
                          color: "#94a3b8",
                          fontSize: 12,
                        }}
                      >
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 500, color: "#e2e8f0" }}>
                        {(order as any).user?.name ?? "Guest"}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        {(order as any).user?.email}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 700,
                        color: "#4d9fff",
                      }}
                    >
                      {formatPrice(order.total)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          border: `1px solid ${statusColor}33`,
                          background: `#111e35`,
                          color: statusColor,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "#475569",
                        fontSize: 12,
                      }}
                    >
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : order.id)
                        }
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          border: "1px solid #1a2744",
                          background: "#1a2744",
                          color: "#64748b",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp size={13} />
                        ) : (
                          <ChevronDown size={13} />
                        )}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${order.id}-exp`}>
                      <td
                        colSpan={6}
                        style={{
                          background: "#0a0f1a",
                          borderTop: "1px solid #1a2744",
                          padding: "12px 16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 13,
                                color: "#94a3b8",
                              }}
                            >
                              <span>
                                {item.part?.name} × {item.quantity}
                              </span>
                              <span
                                style={{ color: "#4d9fff", fontWeight: 600 }}
                              >
                                {formatPrice(
                                  Number(item.price) * item.quantity,
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Promotions ───────────────────────────────────────────────────────────────
function PromotionsTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: promos } = useQuery<Promotion[]>({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data } = await api.get("/admin/promotions");
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromoForm>({
    resolver: zodResolver(promoSchema),
    defaultValues: { type: "PERCENTAGE" },
  });

  const createMutation = useMutation({
    mutationFn: (data: PromoForm) =>
      api.post("/admin/promotions", {
        ...data,
        discount: parseFloat(String(data.discount)),
        usageLimit: data.usageLimit
          ? parseInt(String(data.usageLimit))
          : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-promos"] });
      setShowForm(false);
      reset();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/promotions/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-promos"] }),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            ...btnPrimary,
            boxShadow: "0 4px 16px rgba(212,56,13,0.25)",
          }}
        >
          {showForm ? (
            <>
              <X size={14} /> Cancel
            </>
          ) : (
            <>
              <Plus size={14} /> Create promotion
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div style={{ ...card, overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #1a2744",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Tag size={15} style={{ color: "#4d9fff" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "#f9fafb" }}>
              New promotion
            </span>
          </div>
          <form
            onSubmit={handleSubmit((d) => createMutation.mutate(d))}
            style={{
              padding: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Field label="Promo code *" error={errors.code?.message}>
              <input
                {...register("code")}
                placeholder="SUMMER30"
                style={{
                  ...inputSt,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              />
            </Field>
            <Field label="Description">
              <input
                {...register("description")}
                placeholder="Summer sale — 30% off brakes"
                style={inputSt}
              />
            </Field>
            <Field label="Discount amount *" error={errors.discount?.message}>
              <input
                {...register("discount")}
                type="number"
                step="0.01"
                placeholder="30"
                style={inputSt}
              />
            </Field>
            <Field label="Discount type *">
              <select
                {...register("type")}
                style={{ ...inputSt, cursor: "pointer" }}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed amount (₾)</option>
              </select>
            </Field>
            <Field label="Expiry date">
              <input {...register("expiresAt")} type="date" style={inputSt} />
            </Field>
            <Field label="Usage limit">
              <input
                {...register("usageLimit")}
                type="number"
                placeholder="Unlimited"
                style={inputSt}
              />
            </Field>
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                paddingTop: 16,
                borderTop: "1px solid #1a2744",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                style={btnSecondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                style={{
                  ...btnPrimary,
                  boxShadow: "0 4px 16px rgba(212,56,13,0.3)",
                }}
              >
                {createMutation.isPending ? "Creating…" : "Create promotion"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ ...card, overflow: "hidden" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#0a0f1e" }}>
              {[
                "Code",
                "Discount",
                "Description",
                "Expires",
                "Used",
                "Active",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                    borderBottom: "1px solid #1a2744",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(promos) &&
              promos.map((promo, i) => (
                <tr
                  key={promo.id}
                  style={{ borderTop: i === 0 ? "none" : "1px solid #1a2744" }}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: "#4d9fff",
                        letterSpacing: "0.05em",
                        fontSize: 13,
                      }}
                    >
                      {promo.code}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 600,
                      color: "#f9fafb",
                    }}
                  >
                    {promo.type === "PERCENTAGE"
                      ? `${promo.discount}%`
                      : `₾${promo.discount}`}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>
                    {promo.description ?? "—"}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "#64748b",
                      fontSize: 12,
                    }}
                  >
                    {promo.expiresAt ? formatDate(promo.expiresAt) : "Never"}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>
                    {promo.usageCount}
                    {promo.usageLimit ? ` / ${promo.usageLimit}` : ""}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() =>
                        toggleMutation.mutate({
                          id: promo.id,
                          isActive: !promo.isActive,
                        })
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: promo.isActive ? "#22c55e" : "#334155",
                        display: "flex",
                      }}
                    >
                      {promo.isActive ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsTab() {
  const [saved, setSaved] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 600,
      }}
    >
      <div style={{ ...card, overflow: "hidden" }}>
        <div
          style={{ padding: "16px 24px", borderBottom: "1px solid #1a2744" }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#f9fafb" }}>
            Store information
          </h2>
        </div>
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {[
            { label: "Store name", value: "PriusParts.ge", type: "text" },
            {
              label: "Contact email",
              value: "admin@priusparts.ge",
              type: "email",
            },
            { label: "Support phone", value: "+995 XXX XXX XXX", type: "text" },
          ].map(({ label, value, type }) => (
            <div key={label}>
              <label style={labelSt}>{label}</label>
              <input type={type} defaultValue={value} style={inputSt} />
            </div>
          ))}
          <div>
            <label style={labelSt}>Currency</label>
            <select
              defaultValue="GEL"
              style={{ ...inputSt, cursor: "pointer" }}
            >
              <option value="GEL">Georgian Lari (₾)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <div
          style={{ padding: "16px 24px", borderBottom: "1px solid #1a2744" }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#f9fafb" }}>
            Shipping
          </h2>
        </div>
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <label style={labelSt}>Default shipping cost (₾)</label>
            <input
              type="number"
              defaultValue="9.99"
              step="0.01"
              style={inputSt}
            />
          </div>
          <div>
            <label style={labelSt}>Free shipping threshold (₾)</label>
            <input type="number" defaultValue="200" style={inputSt} />
            <p style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
              Orders above this amount qualify for free shipping
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }}
        style={{
          ...btnPrimary,
          width: "fit-content",
          boxShadow: saved ? "none" : "0 4px 16px rgba(212,56,13,0.3)",
          background: saved
            ? "linear-gradient(135deg,#16a34a,#22c55e)"
            : "linear-gradient(135deg,#1d6fe8,#4d9fff)",
        }}
      >
        {saved ? (
          <>
            <CheckCircle size={14} /> Saved!
          </>
        ) : (
          "Save settings"
        )}
      </button>
    </div>
  );
}
