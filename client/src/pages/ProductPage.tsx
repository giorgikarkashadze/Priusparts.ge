import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Package,
  RotateCcw,
  Shield,
} from "lucide-react";
import { usePart } from "@/hooks/useProducts";
import { useCartStore } from "@/store";
import { formatPrice, discount, cn } from "@/lib/utils";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: part, isLoading, isError } = usePart(slug!);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (isLoading)
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-800 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );

  if (isError || !part)
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-medium mb-2">Part not found</h2>
        <Link to="/catalog" className="btn-primary">
          Back to catalog
        </Link>
      </div>
    );

  const disc = discount(part.price, part.comparePrice);
  const images = part.images.length > 0 ? part.images : [null];

  const handleAddToCart = () => {
    addItem(part, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const avgRating = part.reviews?.length
    ? part.reviews.reduce((sum, r) => sum + r.rating, 0) / part.reviews.length
    : 4.2;

  const CATEGORY_ICONS: Record<string, string> = {
    engine: "🔧",
    brakes: "🛞",
    suspension: "⚙️",
    electrical: "⚡",
    filters: "🌀",
  };
  const icon = CATEGORY_ICONS[part.category.slug] || "🔩";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/catalog" className="hover:text-brand">
          Catalog
        </Link>
        <ChevronRight size={14} />
        <Link
          to={`/catalog?category=${part.category.slug}`}
          className="hover:text-brand"
        >
          {part.category.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs">
          {part.name}
        </span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center relative">
            {images[activeImage] ? (
              <img
                src={images[activeImage]!}
                alt={part.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">{icon}</span>
            )}
            {disc && (
              <div className="absolute top-4 right-4 bg-brand text-white text-sm font-semibold px-3 py-1 rounded-full">
                -{disc}%
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-all",
                    activeImage === i
                      ? "border-brand"
                      : "border-transparent hover:border-gray-300",
                  )}
                >
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
                        padding: 16,
                        background: "#1f2937",
                      }}
                    />
                  ) : (
                    <span className="text-2xl">{icon}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {part.category.name}
            </div>
            <h1 className="text-2xl font-semibold leading-tight">
              {part.name}
            </h1>
            {part.oemNumber && (
              <div className="text-sm text-gray-400 font-mono mt-1">
                OEM: {part.oemNumber}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(avgRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {avgRating.toFixed(1)} ({part.reviews?.length ?? 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-brand">
              {formatPrice(part.price)}
            </span>
            {part.comparePrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(part.comparePrice)}
              </span>
            )}
            {disc && (
              <span className="text-sm bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">
                Save {disc}%
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {part.stock > 10 ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  In stock ({part.stock} available)
                </span>
              </>
            ) : part.stock > 0 ? (
              <>
                <AlertTriangle size={16} className="text-orange-500" />
                <span className="text-sm text-orange-600 dark:text-orange-400">
                  Only {part.stock} left in stock
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-sm text-red-500">Out of stock</span>
              </>
            )}
          </div>

          {/* Description */}
          {part.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {part.description}
            </p>
          )}

          {/* Add to cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-lg transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(part.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-lg transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={part.stock === 0}
              className={cn(
                "btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 transition-all",
                added && "bg-green-600 hover:bg-green-700",
              )}
            >
              <ShoppingCart size={16} />
              {added ? "Added to cart!" : "Add to cart"}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {[
              { icon: Package, text: "Free returns within 30 days" },
              { icon: Shield, text: "Genuine OEM quality" },
              { icon: RotateCcw, text: "2–5 day delivery" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-1 text-center p-2"
              >
                <Icon size={16} className="text-brand" />
                <span className="text-xs text-gray-500 leading-tight">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compatibility table */}
      {part.compatibility && part.compatibility.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Vehicle compatibility</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  {["Make", "Model", "Years"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {part.compatibility.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-4 py-3 font-medium">
                      {c.model.make.name}
                    </td>
                    <td className="px-4 py-3">{c.model.name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.years.sort((a, b) => a - b).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Customer reviews{" "}
          <span className="text-gray-400 font-normal text-base">
            ({part.reviews?.length ?? 0})
          </span>
        </h2>
        {part.reviews && part.reviews.length > 0 ? (
          <div className="space-y-4">
            {part.reviews.map((review) => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center text-sm font-semibold">
                      {review.user.name[0]}
                    </div>
                    <span className="font-medium text-sm">
                      {review.user.name}
                    </span>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {review.comment}
                  </p>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-400">
            <Star size={24} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              No reviews yet. Be the first to review this part.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
