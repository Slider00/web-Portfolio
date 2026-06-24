import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import Marquee from "../components/Marquee";
import { reviews } from "../constants";

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={twMerge(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-50/[.1] bg-gradient-to-r bg-indigo to-storm hover:bg-royal hover-animation"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full bg-white/10 object-cover"
          width="32"
          height="32"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Testimonial() {
  const { t, i18n } = useTranslation();
  const [reviewsList, setReviewsList] = useState(reviews);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isDev = import.meta.env.DEV;
  const apiBase = import.meta.env.VITE_AI_API_URL || (isDev ? "http://localhost:4000" : "");

  useEffect(() => {
    let active = true;
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${apiBase}/api/testimonials`);
        if (!response.ok) throw new Error("Failed to fetch testimonials");
        const data = await response.json();
        if (active) {
          setReviewsList(data);
        }
      } catch (err) {
        console.error("Error loading testimonials from backend, falling back to static reviews.", err);
      }
    };
    fetchTestimonials();
    return () => {
      active = false;
    };
  }, [apiBase]);

  // Dividir los testimonios dinámicamente entre las filas de Marquee
  const firstRow = reviewsList.slice(0, Math.ceil(reviewsList.length / 2));
  const secondRow = reviewsList.slice(Math.ceil(reviewsList.length / 2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) {
      setError(t("testimonial.errorRequired"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    // Generar avatar dinámico con Robohash basado en el nombre
    const avatar = `https://robohash.org/${encodeURIComponent(name.trim())}?size=100x100`;
    const formattedUsername = userName.trim()
      ? userName.trim().startsWith("@")
        ? userName.trim()
        : `@${userName.trim()}`
      : t("testimonial.anonymous");

    const newReview = {
      name: name.trim(),
      username: formattedUsername,
      body: body.trim(),
      img: avatar,
    };

    try {
      const response = await fetch(`${apiBase}/api/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      
      if (!response.ok) {
        throw new Error(t('testimonial.errorSave'));
      }
      
      const savedReview = await response.json();
      setReviewsList((prev) => [savedReview, ...prev]);

      setSuccess(true);
      setName("");
      setUserName("");
      setBody("");
      
      // Desvanecer el mensaje de éxito después de unos segundos
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(t("testimonial.errorPublish"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-start mt-25 md:mt-35 c-space" id="testimonials">
      <h2 className="text-heading">{t("testimonial.title")}</h2>
      
      {/* Carruseles Animados */}
      <div className="relative flex flex-col items-center justify-center w-full mt-12 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review, i) => (
            <ReviewCard key={`${review.username}-${i}`} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review, i) => (
            <ReviewCard key={`${review.username}-${i}`} {...review} />
          ))}
        </Marquee>
        <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none bg-gradient-to-r from-primary"></div>
      </div>

      {/* Formulario de Testimonios */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-16 bg-gradient-to-b from-storm to-indigo p-6 md:p-8 rounded-2xl border border-white/10">
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{t("testimonial.formTitle")}</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {t("testimonial.formSubtitle")}
            </p>
          </div>
          {/* Avatar Preview Dinámico */}
          <div className="hidden md:flex flex-col items-center gap-2 mt-6 p-4 rounded-xl bg-midnight/50 border border-white/5 w-fit">
            <span className="text-[10px] uppercase font-bold text-neutral-400">{t("testimonial.avatarGenerated")}</span>
            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-lavender/30">
              <img
                src={`https://robohash.org/${encodeURIComponent(name.trim() || "JulianCorrea")}?size=100x100`}
                alt="Avatar generado"
                className="size-full object-cover"
              />
            </div>
            <span className="text-xs text-neutral-300 font-semibold">
              {name.trim() || (i18n.language === "es" ? "Tu Nombre / Empresa" : "Your Name / Company")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-300 font-semibold uppercase">{t("testimonial.nameOrCompanyLabel")}</label>
              <input
                type="text"
                required
                placeholder={t("testimonial.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-midnight border border-white/10 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-300 font-semibold uppercase">{t("testimonial.handleLabel")}</label>
              <input
                type="text"
                placeholder={t("testimonial.handlePlaceholder")}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-midnight border border-white/10 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-300 font-semibold uppercase">{t("testimonial.yourCommentLabel")}</label>
            <textarea
              required
              rows={3}
              placeholder={t("testimonial.commentPlaceholder")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="bg-midnight border border-white/10 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender resize-none"
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-lavender hover:bg-lavender/85 text-white font-semibold text-sm rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? t("testimonial.sendingBtn") : t("testimonial.submitBtn")}
            </button>

            {success && (
              <span className="text-xs text-emerald-400 font-semibold animate-pulse">
                {t("testimonial.successMsg")}
              </span>
            )}
            {error && (
              <span className="text-xs text-red-400 font-semibold">
                {error}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
