"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewModal({
  isOpen,
  onOpenChange,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [headline, setHeadline] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewBodyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setReviewBody(value);
    }
  };

  const handleReset = () => {
    setRating(0);
    setHeadline("");
    setReviewBody("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!headline.trim()) {
      toast.error("Please enter a headline.");
      return;
    }
    if (!reviewBody.trim()) {
      toast.error("Please enter your review experience.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API request as requested to ignore actual submit request
    setTimeout(() => {
      toast.success("Thank you! Your review has been submitted.");
      setIsSubmitting(false);
      handleReset();
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          handleReset();
        }
      }}
    >
      <DialogContent className="max-w-[90vw] sm:max-w-155  bg-white border border-neutral-100 rounded-lg p-8 sm:p-10 shadow-2xl overflow-hidden font-sans text-black">
        <DialogHeader className="mb-6 relative">
          <DialogTitle className="text-2xl font-bold font-syne tracking-tight text-neutral-900 mt-2 pr-6">
            Share your thoughts
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Rate Experience */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold font-syne text-neutral-800 tracking-wide">
              Rate your experience*
            </span>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={28}
                    className={cn(
                      "transition-all duration-150 stroke-[1.5]",
                      (hoverRating || rating) >= star
                        ? "text-amber-500 fill-amber-400"
                        : "text-amber-500 fill-none",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Headline Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold font-syne text-neutral-800 tracking-wide">
              Headline*
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Briefly describe your experience."
              className="w-full bg-white border border-neutral-300 rounded-lg py-3.5 px-4 text-sm font-medium placeholder-neutral-400 outline-none transition-colors focus:border-black"
            />
          </div>

          {/* Review Textarea */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold font-syne text-neutral-800 tracking-wide">
                Headline*
              </label>
              <span className="text-xs font-mono text-neutral-400">
                {reviewBody.length}/500
              </span>
            </div>
            <textarea
              value={reviewBody}
              onChange={handleReviewBodyChange}
              placeholder="How was your experience?"
              rows={5}
              className="w-full bg-white border border-neutral-300 rounded-lg py-3.5 px-4 text-sm font-medium placeholder-neutral-400 outline-none transition-colors focus:border-black resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-90 bg-black hover:bg-neutral-800 active:scale-[0.99] disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all text-white font-semibold py-4 px-6 text-sm tracking-widest uppercase rounded-md shadow-md cursor-pointer text-center"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
