import { useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";
import { api } from "../api/client";

function Reviews({ product }) {
  const { currentUser } = useAuth();

  const [allReviews, setAllReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/products/${product.id}`)
      .then((data) => {
        if (!cancelled) setAllReviews(data.reviews || []);
      })
      .catch(() => {
        if (!cancelled) setAllReviews([]);
      });

    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const totalRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length
      : product.rating || 0;

  const loadReviews = () => {
    api
      .get(`/products/${product.id}`)
      .then((data) => setAllReviews(data.reviews || []))
      .catch(() => {
        // ignore
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      await api.post(`/products/${product.id}/reviews`, {
        rating,
        text: text.trim(),
      });

      loadReviews();
      setText("");
      setRating(5);
    } catch {
      // server error: keep form state
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-white/10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold">التقييمات والمراجعات</h3>

        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-[#D4AF37]">
            {totalRating.toFixed(1)}
          </span>

          <div>
            <div className="flex gap-1 text-[#D4AF37]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.round(totalRating) ? "currentColor" : "none"}
                />
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {allReviews.length} تقييم
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Reviews List */}
        <div className="space-y-5">
          {allReviews.length === 0 && (
            <p className="text-gray-500 text-sm">
              لا توجد مراجعات بعد. كوني أول من يقيّم هذا المنتج.
            </p>
          )}

          {allReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#151515] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-bold text-sm">{review.name}</h4>

                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {formatDate(review.date)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 text-[#D4AF37]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        fill={star <= Number(review.rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-7">{review.text}</p>
            </div>
          ))}
        </div>

        {/* Add Review */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#151515] border border-white/10 rounded-2xl p-6 h-fit"
        >
          <h4 className="font-bold mb-1">أضيفي تقييمك</h4>

          <p className="text-xs text-gray-500 mb-5">
            شاركينا تجربتك مع هذا المنتج
            {currentUser ? ` كـ ${currentUser.name}` : ""}
          </p>

          <div className="mb-5">
            <label className="block text-xs text-gray-400 mb-2">
              تقييمك
            </label>

            <div className="flex gap-1 text-[#D4AF37]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="hover:scale-110 transition-transform"
                  aria-label={`${star} نجوم`}
                >
                  <Star
                    size={24}
                    fill={star <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="block text-xs text-gray-400 mb-2">
            مراجعتك
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            placeholder="اكتبي رأيكي في الخامة، المقاس، الجودة..."
            className="
              w-full
              bg-black
              border
              border-white/10
              rounded-xl
              py-3
              px-4
              text-sm
              outline-none
              resize-none
              focus:border-[#D4AF37]
              transition
            "
          />

          <button
            type="submit"
            className="
              mt-4
              w-full
              py-3
              rounded-xl
              bg-[#D4AF37]
              text-black
              font-bold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#C9A227]
              transition-colors
              duration-300
            "
          >
            <MessageSquare size={17} />
            نشر التقييم
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reviews;