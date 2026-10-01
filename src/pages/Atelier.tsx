import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Diamond,
  Hammer,
  Leaf,
  PencilLine,
} from "lucide-react";
import { Photo, Reveal, SectionHeading, Accordion } from "../components/ui";

const steps = [
  {
    title: "A conversation.",
    text: "Tell us what you have in mind. A feeling, a story, a stone you’ve kept. There is no wrong place to begin.",
    icon: PencilLine,
  },
  {
    title: "An idea takes shape.",
    text: "We explore sketches, silhouettes, and carefully selected stones together. You see and approve every detail.",
    icon: Diamond,
  },
  {
    title: "Made with intention.",
    text: "Our craftspeople bring your design to life, setting and finishing each element by hand. Good things take time.",
    icon: Hammer,
  },
  {
    title: "Yours, always.",
    text: "Your one-of-a-kind piece arrives in our signature box, with a care guide and the story of its making.",
    icon: Check,
  },
];
const initial = {
  name: "",
  email: "",
  project: "",
  metal: "",
  timeline: "",
  budget: "",
  notes: "",
};
export function Atelier() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof initial, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const timer = setTimeout(
        () =>
          document
            .getElementById(hash.slice(1))
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
      return () => clearTimeout(timer);
    }
  }, [hash]);
  const update = (key: keyof typeof initial, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!form.project) next.project = "Choose a project type.";
    if (!form.metal) next.metal = "Choose your preferred metal.";
    if (!form.timeline) next.timeline = "Choose an approximate timeline.";
    if (!form.budget) next.budget = "Choose a budget band.";
    if (form.notes.trim().length < 20)
      next.notes =
        "Share a little more about your idea (at least 20 characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      setTimeout(
        () =>
          document
            .querySelector<HTMLElement>('#inquiry [aria-invalid="true"]')
            ?.focus(),
        0,
      );
      return;
    }
    setSubmitted(true);
  };
  return (
    <>
      <section className="atelier-hero">
        <div className="atelier-hero-copy">
          <span className="eyebrow">THE SAPPHELINE ATELIER</span>
          <h1>
            A little of us.
            <br /> <em>All of you.</em>
          </h1>
          <p>
            Precious materials. Patient hands. Personal stories.
            <br /> Welcome to where it all comes together.
          </p>
          <a href="#inquiry" className="button primary">
            Begin your story
            <ArrowRight size={17} />
          </a>
          <span className="atelier-hero-footnote">
            ONE PIECE. ONE PERSON. ONE EXTRAORDINARY STORY.
          </span>
        </div>
        <Photo
          src={`${import.meta.env.BASE_URL}images/editorial.png`}
          alt="A hand wearing a sculptural sapphire ring in a quiet moment of daylight"
          fetchPriority="high"
        />
      </section>
      <section id="craft" className="atelier-philosophy container">
        <Reveal>
          <span className="eyebrow">THE BEAUTY OF THE PROCESS</span>
          <h2>
            We make jewelry.
            <br /> <em>You give it meaning.</em>
          </h2>
          <p>
            A piece worn every day becomes part of your life. A memory held in
            metal.
            <br className="desktop-break" /> A small, private symbol. That is
            what we design for.
          </p>
          <div className="philosophy-grid">
            <div>
              <Leaf size={29} strokeWidth={1} />
              <h3>Materials with a conscience.</h3>
              <p>
                Recycled precious metals and individually selected gemstones,
                chosen with care for their character, color, and lasting
                quality.
              </p>
            </div>
            <div>
              <Hammer size={29} strokeWidth={1} />
              <h3>A human way of making.</h3>
              <p>
                Small batches and skilled hands. We believe in the beauty of a
                considered process, where every finish and setting receives
                personal attention.
              </p>
            </div>
            <div>
              <Diamond size={29} strokeWidth={1} />
              <h3>Beyond a season.</h3>
              <p>
                Forms that feel contemporary and enduring. Made to be worn,
                loved, cared for, and passed along with all their stories
                intact.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="process-section">
        <div className="container">
          <SectionHeading
            eyebrow="A PERSONAL COMMISSION"
            title="From a feeling to a forever piece."
            text="Your idea, our hands. Four thoughtful steps to something entirely your own."
          />
          <div className="process-grid">
            {steps.map((step, i) => (
              <div key={step.title}>
                <div className="process-step-top">
                  <span>0{i + 1}</span>
                  <step.icon size={26} strokeWidth={1} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="inquiry-section container" id="inquiry">
        <div className="inquiry-copy">
          <span className="eyebrow">EVERY PIECE BEGINS SOMEWHERE</span>
          <h2>
            Let’s make
            <br /> <em>it personal.</em>
          </h2>
          <p>
            A new design, an heirloom reimagined, or a meaningful stone given a
            new setting. Tell us your story.
          </p>
          <div className="inquiry-aside">
            <span>GOOD TO KNOW</span>
            <p>
              Personal commissions typically begin at $500, with a making time
              of 6–10 weeks after design approval.
            </p>
            <p>
              Have an idea that’s still taking shape? We’re here for that, too.
            </p>
          </div>
          <Accordion title="Can you work with my own stone?">
            <p>
              Absolutely. We can explore a new setting for a stone you already
              treasure. Our initial design conversation would include the
              stone’s dimensions and condition.
            </p>
          </Accordion>
          <Accordion title="Can I personalize an existing piece?">
            <p>
              Yes. A different stone, a special finish, or a subtle engraving
              can make one of our collection pieces entirely yours.
            </p>
          </Accordion>
        </div>
        <div className="inquiry-form-wrap">
          {submitted ? (
            <div className="inquiry-confirmation" role="status" tabIndex={-1}>
              <div className="confirmation-check">
                <Check size={27} strokeWidth={1.4} />
              </div>
              <span className="eyebrow">YOUR STORY, BEAUTIFULLY BEGUN</span>
              <h3>Thank you, {form.name.trim().split(" ")[0]}.</h3>
              <p>
                Your {form.project.toLowerCase()} idea sounds like the start of
                something lovely.
              </p>
              <dl>
                <div>
                  <dt>Preferred metal</dt>
                  <dd>{form.metal}</dd>
                </div>
                <div>
                  <dt>Timeline</dt>
                  <dd>{form.timeline}</dd>
                </div>
                <div>
                  <dt>Budget</dt>
                  <dd>{form.budget}</dd>
                </div>
              </dl>
              <p className="demo-note">
                This is a demo confirmation. Your inquiry has not been sent, and
                no email will follow.
              </p>
              <button
                className="button primary"
                onClick={() => {
                  setSubmitted(false);
                  setForm(initial);
                  setErrors({});
                }}
              >
                Start a new inquiry
                <ArrowRight size={16} />
              </button>
              <Link className="arrow-link" to="/shop">
                Explore the collection
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="inquiry-form">
              <div className="form-row">
                {(["name", "email"] as const).map((key) => (
                  <div className="form-field" key={key}>
                    <label htmlFor={`inquiry-${key}`}>
                      {key === "name" ? "Your name" : "Email address"}{" "}
                      <span>*</span>
                    </label>
                    <input
                      id={`inquiry-${key}`}
                      type={key === "email" ? "email" : "text"}
                      autoComplete={key}
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      placeholder={
                        key === "name"
                          ? "First and last name"
                          : "you@example.com"
                      }
                      required
                      aria-invalid={!!errors[key]}
                      aria-describedby={
                        errors[key] ? `error-${key}` : undefined
                      }
                    />
                    {errors[key] && (
                      <p id={`error-${key}`} className="form-error">
                        {errors[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="form-row">
                {[
                  {
                    key: "project" as const,
                    label: "Project type",
                    placeholder: "What are you dreaming of?",
                    options: [
                      "A bespoke ring",
                      "A bespoke necklace",
                      "A bespoke pair of earrings",
                      "An heirloom redesign",
                      "Personalize a collection piece",
                    ],
                  },
                  {
                    key: "metal" as const,
                    label: "Preferred metal",
                    placeholder: "Choose a metal",
                    options: [
                      "Sterling silver",
                      "14k white gold",
                      "14k yellow gold",
                      "Platinum",
                      "Open to your guidance",
                    ],
                  },
                ].map((field) => (
                  <div className="form-field" key={field.key}>
                    <label htmlFor={`inquiry-${field.key}`}>
                      {field.label} <span>*</span>
                    </label>
                    <select
                      id={`inquiry-${field.key}`}
                      value={form[field.key]}
                      onChange={(e) => update(field.key, e.target.value)}
                      required
                      aria-invalid={!!errors[field.key]}
                      aria-describedby={
                        errors[field.key] ? `error-${field.key}` : undefined
                      }
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    {errors[field.key] && (
                      <p className="form-error" id={`error-${field.key}`}>
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="form-row">
                {[
                  {
                    key: "timeline" as const,
                    label: "Your timeline",
                    placeholder: "When is your moment?",
                    options: [
                      "Within 2 months",
                      "In 3–6 months",
                      "In 6–12 months",
                      "No rush — take your time",
                    ],
                  },
                  {
                    key: "budget" as const,
                    label: "Budget band",
                    placeholder: "A comfortable starting point",
                    options: [
                      "$500–$1,000",
                      "$1,000–$2,500",
                      "$2,500–$5,000",
                      "$5,000+",
                      "I’d like some guidance",
                    ],
                  },
                ].map((field) => (
                  <div className="form-field" key={field.key}>
                    <label htmlFor={`inquiry-${field.key}`}>
                      {field.label} <span>*</span>
                    </label>
                    <select
                      id={`inquiry-${field.key}`}
                      value={form[field.key]}
                      onChange={(e) => update(field.key, e.target.value)}
                      required
                      aria-invalid={!!errors[field.key]}
                      aria-describedby={
                        errors[field.key] ? `error-${field.key}` : undefined
                      }
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    {errors[field.key] && (
                      <p className="form-error" id={`error-${field.key}`}>
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="form-field">
                <label htmlFor="inquiry-notes">
                  A little about your idea <span>*</span>
                </label>
                <textarea
                  id="inquiry-notes"
                  rows={5}
                  placeholder="A story, a special occasion, a shape or stone you love. We’d love to hear it."
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  maxLength={2000}
                  required
                  aria-invalid={!!errors.notes}
                  aria-describedby={errors.notes ? "error-notes" : undefined}
                />
                {errors.notes && (
                  <p className="form-error" id="error-notes">
                    {errors.notes}
                  </p>
                )}
                <small>{form.notes.length} / 2,000 characters</small>
              </div>
              <button className="button primary" type="submit">
                Share your story
                <ArrowRight size={17} />
              </button>
              <p className="form-demo">
                A front-end inquiry demonstration. Your details are never sent.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
