import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Heart,
  Sparkles,
  Send,
  CheckCircle2,
  Gift,
  Copy,
  ExternalLink,
  Flame,
  Bike,
  Utensils,
  Smile,
  Check
} from 'lucide-react';
import { RESTAURANT_CONFIG } from '../restaurant.config';

export interface CustomerFeedback {
  orderId: string;
  orderNumber: string;
  overallRating: number;
  foodRating: number;
  deliveryRating: number;
  selectedTags: string[];
  comment: string;
  wouldRecommend: boolean;
  submittedAt: string;
}

interface PostOrderFeedbackFormProps {
  orderId: string;
  orderNumber: string;
  items?: { name: string; quantity: number }[];
  onFeedbackSubmitted?: (feedback: CustomerFeedback) => void;
}

const QUICK_TAGS = [
  { id: 'piping-hot', label: '🔥 Piping Hot', category: 'food' },
  { id: 'juicy-wagyu', label: '🥩 Juicy & Tender', category: 'food' },
  { id: 'crispy-crust', label: '🍕 Crisp Crust', category: 'food' },
  { id: 'fast-dispatch', label: '⚡ Fast Delivery', category: 'service' },
  { id: 'great-packaging', label: '📦 Thermal Sealed', category: 'service' },
  { id: 'polite-rider', label: '🛵 Courteous Rider', category: 'service' },
  { id: 'rich-flavors', label: '✨ Flavorful Sauces', category: 'food' },
  { id: 'generous-portions', label: '🍽️ Generous Portion', category: 'food' },
];

const RATING_DESCRIPTIONS: Record<number, { text: string; emoji: string; color: string }> = {
  1: { text: 'Disappointed - Needs improvement', emoji: '😞', color: '#EF4444' },
  2: { text: 'Fair - Could be better', emoji: '😐', color: '#F97316' },
  3: { text: 'Good - Met expectations', emoji: '🙂', color: '#F59E0B' },
  4: { text: 'Great! - Delicious & fast', emoji: '😋', color: '#8BC53D' },
  5: { text: 'Outstanding! - Pure perfection', emoji: '🤩', color: '#8BC53D' },
};

export const PostOrderFeedbackForm: React.FC<PostOrderFeedbackFormProps> = ({
  orderId,
  orderNumber,
  items = [],
  onFeedbackSubmitted
}) => {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [foodRating, setFoodRating] = useState<number>(5);
  const [deliveryRating, setDeliveryRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['piping-hot', 'fast-dispatch']);
  const [comment, setComment] = useState<string>('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copiedCoupon, setCopiedCoupon] = useState<boolean>(false);
  const [showDetailedRatings, setShowDetailedRatings] = useState<boolean>(false);

  // Check if feedback was already stored in localStorage for this order
  useEffect(() => {
    try {
      const savedFeedback = localStorage.getItem(`dish_republic_feedback_${orderId}`);
      if (savedFeedback) {
        setIsSubmitted(true);
      }
    } catch {
      // ignore storage access errors
    }
  }, [orderId]);

  const toggleTag = (tagLabel: string) => {
    if (selectedTags.includes(tagLabel)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagLabel));
    } else {
      setSelectedTags([...selectedTags, tagLabel]);
    }
  };

  const handleQuickAddPrompt = (promptText: string) => {
    setComment((prev) => {
      if (!prev) return promptText;
      return `${prev} ${promptText}`;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const feedbackData: CustomerFeedback = {
      orderId,
      orderNumber,
      overallRating,
      foodRating,
      deliveryRating,
      selectedTags,
      comment,
      wouldRecommend,
      submittedAt: new Date().toISOString()
    };

    setTimeout(() => {
      try {
        localStorage.setItem(`dish_republic_feedback_${orderId}`, JSON.stringify(feedbackData));
      } catch {
        // ignore storage errors
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(feedbackData);
      }
    }, 600);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('THANKYOU10');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const activeRating = hoverRating || overallRating;
  const ratingInfo = RATING_DESCRIPTIONS[activeRating] || RATING_DESCRIPTIONS[5];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#012F13] to-[#011207] rounded-3xl p-6 sm:p-7 border border-[#8BC53D] shadow-2xl text-center space-y-5"
      >
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full bg-[#8BC53D] text-[#011207] flex items-center justify-center mx-auto shadow-lg shadow-[#8BC53D]/30 text-2xl">
            <CheckCircle2 className="w-8 h-8 text-[#011207]" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-black text-xs flex items-center justify-center font-bold"
          >
            ★
          </motion.div>
        </div>

        <div className="space-y-1">
          <h4 className="text-lg sm:text-2xl text-white uppercase tracking-tight font-anton">
            Thank You for Your Feedback!
          </h4>
          <p className="text-xs sm:text-sm text-[#E2F0CC]/80 max-w-md mx-auto">
            Your review helps our chefs and pitmasters continually elevate the flame-grilled street food experience for Islamabad & Rawalpindi.
          </p>
        </div>

        {/* Voucher Gift Reward for Completing Feedback */}
        <div className="bg-[#011207]/90 rounded-2xl p-4 border border-[#8BC53D]/40 max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#8BC53D]/20 text-[#8BC53D] flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8BC53D] font-bold block">
                Feedback Reward
              </span>
              <span className="text-xs text-white font-bold">10% OFF Next Order</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="px-3 py-1.5 rounded-lg bg-[#012F13] border border-[#8BC53D]/50 text-[#8BC53D] font-black text-xs tracking-wider">
              THANKYOU10
            </div>
            <button
              onClick={handleCopyCoupon}
              className="p-2 rounded-lg bg-[#8BC53D] text-[#011207] hover:bg-[#8BC53D]/90 transition-colors cursor-pointer"
              title="Copy coupon code"
            >
              {copiedCoupon ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Google Reviews Option */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href={RESTAURANT_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#E2F0CC] text-xs font-bold transition-colors cursor-pointer border border-white/10"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Share on Google Reviews</span>
            <ExternalLink className="w-3 h-3 text-white/50" />
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#011207] rounded-3xl p-5 sm:p-7 border border-[#8BC53D]/30 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#8BC53D]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#8BC53D]/20 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#012F13] border border-[#8BC53D]/40 text-[#8BC53D] flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-2xl text-white uppercase tracking-tight font-anton">
                Rate Your Meal & Service
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-[#8BC53D]/20 text-[#8BC53D] text-[10px] font-bold">
                {orderNumber}
              </span>
            </div>
            <p className="text-xs text-[#E2F0CC]/70">
              Help us maintain the highest standard of artisan street dining
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012F13] border border-[#8BC53D]/30 text-[10px] text-[#8BC53D]">
          <Gift className="w-3.5 h-3.5" />
          <span>Reward Inside</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
        {/* Main 5-Star Experience Rating */}
        <div className="text-center space-y-2.5 bg-[#012F13]/60 rounded-2xl p-4 border border-[#8BC53D]/20">
          <label className="text-xs font-bold text-[#E2F0CC] uppercase tracking-wider block">
            Overall Satisfaction
          </label>

          <div className="flex justify-center items-center gap-2 sm:gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= activeRating;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setOverallRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 sm:p-2 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-white/20 hover:text-white/40'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Rating Descriptive Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#011207] border border-[#8BC53D]/30 text-xs font-medium">
            <span className="text-base">{ratingInfo.emoji}</span>
            <span className="font-bold text-white">{activeRating}/5 Stars:</span>
            <span style={{ color: ratingInfo.color }} className="font-medium">
              {ratingInfo.text}
            </span>
          </div>
        </div>

        {/* Quick Attribute Tags Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#E2F0CC]/80 uppercase tracking-wider">
              What stood out most?
            </label>
            <span className="text-[10px] text-[#E2F0CC]/50">Select all that apply</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.label);
              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleTag(tag.label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#8BC53D] text-[#011207] shadow-md shadow-[#8BC53D]/20 scale-102 border border-[#8BC53D]'
                      : 'bg-[#012F13] text-[#E2F0CC]/80 hover:bg-[#073B1B] hover:text-white border border-[#8BC53D]/20'
                  }`}
                >
                  {tag.label}
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle Detailed Split Ratings (Food vs Delivery) */}
        <div className="border-t border-[#8BC53D]/15 pt-3">
          <button
            type="button"
            onClick={() => setShowDetailedRatings(!showDetailedRatings)}
            className="text-xs font-bold text-[#8BC53D] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showDetailedRatings ? 'Hide detailed scores' : 'Rate Food Taste & Delivery separately (optional)'}</span>
          </button>

          <AnimatePresence>
            {showDetailedRatings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 overflow-hidden"
              >
                {/* Food Taste Rating */}
                <div className="bg-[#012F13] p-3 rounded-2xl border border-[#8BC53D]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#8BC53D]" />
                      Food Flavor & Crispness
                    </span>
                    <span className="font-bold text-[#8BC53D]">{foodRating}/5</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setFoodRating(num)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          num <= foodRating ? 'bg-[#8BC53D] text-[#011207]' : 'bg-[#011207] text-[#E2F0CC]/40'
                        }`}
                      >
                        {num}★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery & Speed Rating */}
                <div className="bg-[#012F13] p-3 rounded-2xl border border-[#8BC53D]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Bike className="w-3.5 h-3.5 text-[#8BC53D]" />
                      Delivery Speed & Packaging
                    </span>
                    <span className="font-bold text-[#8BC53D]">{deliveryRating}/5</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setDeliveryRating(num)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          num <= deliveryRating ? 'bg-[#8BC53D] text-[#011207]' : 'bg-[#011207] text-[#E2F0CC]/40'
                        }`}
                      >
                        {num}★
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Written Review & Comment Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#E2F0CC]/80 uppercase tracking-wider">
              Comments & Suggestions
            </label>
            <span className="text-[10px] text-[#E2F0CC]/50">{comment.length}/300 chars</span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 300))}
            placeholder="Tell us what you loved about your meal or anything our kitchen/rider can improve on next time..."
            rows={3}
            className="w-full bg-[#012F13] border border-[#8BC53D]/30 rounded-2xl p-3.5 text-xs text-white placeholder-[#E2F0CC]/40 focus:outline-none focus:border-[#8BC53D] transition-colors resize-none leading-relaxed"
          />

          {/* Quick Comment Starters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#E2F0CC]/50">Quick ideas:</span>
            {[
              "Double truffle was incredible!",
              "Wings were scorching hot 🔥",
              "Arrived right on time 🛵"
            ].map((prompt, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleQuickAddPrompt(prompt)}
                className="text-[10px] bg-[#012F13] hover:bg-[#073B1B] text-[#E2F0CC]/80 hover:text-white px-2 py-0.5 rounded-md border border-[#8BC53D]/20 transition-colors cursor-pointer"
              >
                + {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Pill */}
        <div className="bg-[#012F13]/80 p-3 rounded-2xl border border-[#8BC53D]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#8BC53D]" />
            <span className="text-xs text-white font-bold">Would you order from Dish Republic again?</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setWouldRecommend(true)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wouldRecommend
                  ? 'bg-[#8BC53D] text-[#011207] shadow'
                  : 'bg-[#011207] text-[#E2F0CC]/60 hover:text-white'
              }`}
            >
              👍 Yes, definitely!
            </button>
            <button
              type="button"
              onClick={() => setWouldRecommend(false)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !wouldRecommend
                  ? 'bg-[#EF4444] text-white shadow'
                  : 'bg-[#011207] text-[#E2F0CC]/60 hover:text-white'
              }`}
            >
              👎 Not sure
            </button>
          </div>
        </div>

        {/* Submit Feedback Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-2xl bg-[#8BC53D] hover:bg-[#8BC53D]/90 text-[#011207] font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8BC53D]/25 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-[#011207] border-t-transparent animate-spin" />
                <span>Recording Feedback...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Feedback & Unlock Reward</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
