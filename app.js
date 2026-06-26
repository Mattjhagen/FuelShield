const {
  useMemo,
  useState
} = React;
const plans = [{
  name: "Bronze",
  price: "$29",
  gallons: "40 protected gallons/month",
  threshold: "Protection above $4.25/gal",
  detail: "Dedicated Fuel Card",
  cta: "Estimate Bronze"
}, {
  name: "Silver",
  price: "$50",
  gallons: "75 protected gallons/month",
  threshold: "Protection above $3.50/gal",
  detail: "90% monthly card-use requirement",
  cta: "Estimate Silver",
  popular: true
}, {
  name: "Gold",
  price: "$89",
  gallons: "125 protected gallons/month",
  threshold: "Protection above $3.25/gal",
  detail: "Priority account review",
  cta: "Estimate Gold"
}];
const protocolItems = [["Fuel Card required", "Covered fuel must be purchased with the issued FuelShield card for the transaction to qualify."], ["Monthly usage threshold", "Plans may require a minimum share of monthly fuel purchases to run through the card."], ["Suspension for misuse", "Repeatedly fueling with another payment method or missing required usage can suspend protection."], ["Reimbursements are capped", "Protection applies only to eligible gallons within the included monthly allowance."], ["Extra gallons are market price", "Gallons beyond the plan allowance are billed at pump price or receive no protection."]];
const faqs = [["What happens if gas is below my protected price?", "You simply pay the lower pump price. Reimbursements only apply when the eligible pump price is above your plan's protected price."], ["What if I exceed my gallon allowance?", "Your plan protection stops at the included gallons. Extra gallons are billed at market price or receive no protection."], ["Why require the Fuel Card every time?", "The card verifies price, location, gallons, and usage. That transaction data is how FuelShield confirms coverage and prevents misuse."], ["Can protection be suspended?", "Yes. Missing required card usage or repeatedly using another payment method for covered fuel can suspend protection until the account is reviewed."]];
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
function App() {
  const [pumpPrice, setPumpPrice] = useState("4.65");
  const [protectedPrice, setProtectedPrice] = useState("3.50");
  const [coveredGallons, setCoveredGallons] = useState("75");
  const [form, setForm] = useState({
    name: "",
    email: "",
    zip: "",
    gallons: "",
    plan: "Silver"
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const estimate = useMemo(() => {
    const pump = Math.max(parseFloat(pumpPrice) || 0, 0);
    const protectedRate = Math.max(parseFloat(protectedPrice) || 0, 0);
    const gallons = Math.max(parseFloat(coveredGallons) || 0, 0);
    const spread = Math.max(pump - protectedRate, 0);
    return {
      spread,
      gallons,
      total: spread * gallons
    };
  }, [pumpPrice, protectedPrice, coveredGallons]);
  function updateField(event) {
    const {
      name,
      value
    } = event.target;
    setForm(current => ({
      ...current,
      [name]: value
    }));
    setErrors(current => ({
      ...current,
      [name]: ""
    }));
    setSubmitted(false);
  }
  function validateWaitlist() {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const zipPattern = /^\d{5}$/;
    const gallons = Number(form.gallons);
    if (form.name.trim().length < 2) {
      nextErrors.name = "Enter your full name.";
    }
    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!zipPattern.test(form.zip.trim())) {
      nextErrors.zip = "Enter a 5-digit ZIP code.";
    }
    if (!Number.isFinite(gallons) || gallons < 10 || gallons > 250) {
      nextErrors.gallons = "Enter monthly gallons between 10 and 250.";
    }
    if (!form.plan) {
      nextErrors.plan = "Choose a preferred plan.";
    }
    return nextErrors;
  }
  function submitWaitlist(event) {
    event.preventDefault();
    const nextErrors = validateWaitlist();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }
    const entry = {
      ...form,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("fuelshield.waitlist", JSON.stringify(entry));
    setSubmitted(true);
  }
  return React.createElement("div", {
    className: "min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(54,226,143,0.18),transparent_34rem),radial-gradient(circle_at_top_right,rgba(58,184,255,0.16),transparent_30rem),linear-gradient(180deg,#071018_0%,#08131d_42%,#050b12_100%)]"
  }, React.createElement("a", {
    href: "#main",
    className: "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-shield-mint focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-950"
  }, "Skip to content"), React.createElement(Header, null), React.createElement("main", {
    id: "main"
  }, React.createElement(Hero, null), React.createElement(HowItWorks, null), React.createElement(Plans, null), React.createElement(Protocol, null), React.createElement(Calculator, {
    pumpPrice: pumpPrice,
    setPumpPrice: setPumpPrice,
    protectedPrice: protectedPrice,
    setProtectedPrice: setProtectedPrice,
    coveredGallons: coveredGallons,
    setCoveredGallons: setCoveredGallons,
    estimate: estimate
  }), React.createElement(FAQ, null), React.createElement(Waitlist, {
    form: form,
    errors: errors,
    submitted: submitted,
    updateField: updateField,
    submitWaitlist: submitWaitlist
  })), React.createElement("footer", {
    className: "mx-auto flex w-[min(100%_-_2rem,1160px)] flex-col gap-3 border-t border-white/10 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between"
  }, React.createElement("span", {
    className: "font-semibold text-slate-200"
  }, "FuelShield"), React.createElement("span", null, "Gas price protection subscriptions for predictable monthly driving costs.")));
}
function Header() {
  return React.createElement("header", {
    className: "sticky top-0 z-40 border-b border-white/10 bg-[#071018]/80 backdrop-blur-xl"
  }, React.createElement("nav", {
    className: "mx-auto flex min-h-[76px] w-[min(100%_-_2rem,1160px)] items-center justify-between gap-5",
    "aria-label": "Primary navigation"
  }, React.createElement("a", {
    href: "#",
    className: "flex items-center gap-3 font-extrabold tracking-normal",
    "aria-label": "FuelShield home"
  }, React.createElement("img", {
    src: "./assets/fuelshield-mark.svg",
    alt: "",
    className: "h-10 w-10 rounded-xl shadow-glow"
  }), React.createElement("span", null, "FuelShield")), React.createElement("div", {
    className: "hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex"
  }, React.createElement("a", {
    className: "transition hover:text-white",
    href: "#how-it-works"
  }, "How it works"), React.createElement("a", {
    className: "transition hover:text-white",
    href: "#plans"
  }, "Plans"), React.createElement("a", {
    className: "transition hover:text-white",
    href: "#protocol"
  }, "Protocol"), React.createElement("a", {
    className: "transition hover:text-white",
    href: "#faq"
  }, "FAQ")), React.createElement("a", {
    href: "#waitlist",
    className: "rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-shield-blue/60 hover:bg-shield-blue/10"
  }, "Join Waitlist")));
}
function Hero() {
  return React.createElement("section", {
    className: "mx-auto grid w-[min(100%_-_2rem,1160px)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.85fr] lg:py-24",
    "aria-labelledby": "hero-title"
  }, React.createElement("div", null, React.createElement("p", {
    className: "mb-5 inline-flex items-center gap-2 rounded-full border border-shield-mint/25 bg-shield-mint/10 px-3 py-2 text-sm font-bold text-emerald-100"
  }, React.createElement("span", {
    className: "h-2.5 w-2.5 rounded-full bg-shield-mint shadow-[0_0_0_7px_rgba(54,226,143,0.13)]"
  }), "Monthly gas price protection"), React.createElement("h1", {
    id: "hero-title",
    className: "max-w-4xl text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-6xl lg:text-7xl"
  }, "Know your fuel cost before prices spike."), React.createElement("p", {
    className: "mt-6 max-w-2xl text-lg leading-8 text-slate-300"
  }, "FuelShield gives drivers a protected fuel price, a monthly gallon allowance, and a dedicated Fuel Card that verifies every covered purchase. When pump prices rise above your plan threshold, eligible gallons are reimbursed up to your allowance."), React.createElement("div", {
    className: "mt-8 flex flex-col gap-3 sm:flex-row"
  }, React.createElement("a", {
    className: "rounded-full bg-gradient-to-r from-shield-mint to-emerald-300 px-6 py-3 text-center font-extrabold text-slate-950 shadow-glow transition hover:-translate-y-0.5",
    href: "#waitlist"
  }, "Request Early Access"), React.createElement("a", {
    className: "rounded-full border border-white/15 bg-white/5 px-6 py-3 text-center font-extrabold text-white transition hover:-translate-y-0.5 hover:border-shield-blue/60 hover:bg-shield-blue/10",
    href: "#how-it-works"
  }, "See How It Works")), React.createElement("div", {
    className: "mt-9 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] sm:grid-cols-3"
  }, [["40-125", "protected gallons monthly"], ["1 card", "required for covered fuel"], ["Live", "monthly protection tracking"]].map(([value, label]) => React.createElement("div", {
    key: label,
    className: "border-b border-white/10 p-5 sm:border-b-0 sm:border-r last:border-0"
  }, React.createElement("span", {
    className: "block text-xl font-black text-white"
  }, value), React.createElement("span", {
    className: "text-sm text-slate-400"
  }, label))))), React.createElement("div", {
    className: "relative grid min-h-[390px] place-items-center"
  }, React.createElement("div", {
    className: "absolute h-[82%] w-[82%] rounded-full bg-[conic-gradient(from_160deg,rgba(54,226,143,0.25),rgba(58,184,255,0.34),transparent_68%)] blur-md"
  }), React.createElement("div", {
    className: "relative aspect-[1.58] w-[min(100%,430px)] rotate-[-4deg] overflow-hidden rounded-[30px] border border-white/25 bg-gradient-to-br from-emerald-300 to-blue-500 p-7 text-slate-950 shadow-card"
  }, React.createElement("div", {
    className: "absolute -right-24 -top-28 h-64 w-64 rounded-full bg-white/25"
  }), React.createElement("div", {
    className: "absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-white/20"
  }), React.createElement("div", {
    className: "relative flex items-start justify-between gap-4"
  }, React.createElement("span", {
    className: "text-2xl font-black"
  }, "FuelShield"), React.createElement("span", {
    className: "h-10 w-14 rounded-xl border border-white/60 bg-white/50 shadow-inner"
  })), React.createElement("div", {
    className: "relative my-10 text-2xl font-black tracking-[0.16em] sm:text-3xl"
  }, "4829\xA01175\xA09034\xA02218"), React.createElement("div", {
    className: "relative flex items-end justify-between gap-5"
  }, React.createElement("div", null, React.createElement("span", {
    className: "block text-xs font-black uppercase tracking-wider text-slate-900/70"
  }, "Allowance"), React.createElement("span", {
    className: "text-lg font-black"
  }, "75 GAL / MO")), React.createElement("div", null, React.createElement("span", {
    className: "block text-xs font-black uppercase tracking-wider text-slate-900/70"
  }, "Type"), React.createElement("span", {
    className: "text-lg font-black"
  }, "Protected Fuel Card")))), React.createElement("aside", {
    className: "relative mt-[-22px] w-full rounded-2xl border border-white/15 bg-[#0b1824]/90 p-4 text-sm text-slate-200 shadow-card backdrop-blur lg:absolute lg:bottom-8 lg:right-0 lg:mt-0 lg:max-w-60"
  }, React.createElement("strong", {
    className: "mb-1 block text-shield-mint"
  }, "Card verified"), "Covered purchases must run through the Fuel Card to keep protection active.")));
}
function SectionHeading({
  title,
  children
}) {
  return React.createElement("div", {
    className: "mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
  }, React.createElement("h2", {
    className: "text-4xl font-black leading-tight tracking-normal text-white lg:text-5xl"
  }, title), React.createElement("p", {
    className: "max-w-xl text-slate-400"
  }, children));
}
function HowItWorks() {
  return React.createElement("section", {
    id: "how-it-works",
    className: "mx-auto w-[min(100%_-_2rem,1160px)] py-16",
    "aria-labelledby": "how-title"
  }, React.createElement(SectionHeading, {
    title: "How it works"
  }, "FuelShield is built around simple monthly coverage: pick a plan, fuel with the card, and receive protection when pump prices climb above your plan price."), React.createElement("div", {
    className: "grid gap-5 md:grid-cols-3"
  }, [["1", "Subscribe monthly", "Choose the gallon allowance and protected price that matches your driving pattern, then keep coverage active month to month."], ["2", "Use your Fuel Card", "Every covered fuel purchase must be made with the FuelShield card so gallons, prices, and plan compliance can be verified."], ["3", "Get protected", "When eligible pump prices exceed your protected price, FuelShield estimates reimbursement on covered gallons up to your monthly cap."]].map(([step, title, body]) => React.createElement("article", {
    key: title,
    className: "rounded-3xl border border-white/10 bg-gradient-to-b from-[#122235]/95 to-[#0a1622]/90 p-6 shadow-card transition hover:-translate-y-1 hover:border-shield-blue/40"
  }, React.createElement("div", {
    className: "mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-shield-mint to-shield-blue font-black text-slate-950"
  }, step), React.createElement("h3", {
    className: "text-xl font-black text-white"
  }, title), React.createElement("p", {
    className: "mt-2 text-slate-400"
  }, body)))));
}
function Plans() {
  return React.createElement("section", {
    id: "plans",
    className: "bg-white/[0.025] py-16",
    "aria-labelledby": "plans-title"
  }, React.createElement("div", {
    className: "mx-auto w-[min(100%_-_2rem,1160px)]"
  }, React.createElement(SectionHeading, {
    title: "Pricing plans"
  }, "Start with a practical allowance and upgrade as your monthly driving needs grow. All plans include a dedicated Fuel Card."), React.createElement("div", {
    className: "grid gap-5 md:grid-cols-3"
  }, plans.map(plan => React.createElement("article", {
    key: plan.name,
    className: `relative flex min-h-full flex-col rounded-3xl border bg-gradient-to-b from-[#122235]/95 to-[#0a1622]/90 p-6 shadow-card transition hover:-translate-y-1 ${plan.popular ? "border-shield-mint/50 shadow-glow" : "border-white/10 hover:border-shield-blue/40"}`
  }, plan.popular && React.createElement("span", {
    className: "absolute right-5 top-5 rounded-full bg-shield-mint px-3 py-1 text-xs font-black text-slate-950"
  }, "Most Popular"), React.createElement("h3", {
    className: "text-xl font-black"
  }, plan.name), React.createElement("div", {
    className: "mt-3 text-5xl font-black"
  }, plan.price, React.createElement("span", {
    className: "text-base font-bold text-slate-400"
  }, "/mo")), React.createElement("ul", {
    className: "my-6 grid gap-3 text-slate-300"
  }, [plan.gallons, plan.threshold, plan.detail].map(feature => React.createElement("li", {
    key: feature,
    className: "flex gap-3"
  }, React.createElement("span", {
    className: "mt-2 h-2.5 w-2.5 rounded-full bg-shield-mint shadow-[0_0_0_5px_rgba(54,226,143,0.1)]"
  }), React.createElement("span", null, feature)))), React.createElement("a", {
    href: "#calculator",
    className: `mt-auto rounded-full px-5 py-3 text-center font-black transition hover:-translate-y-0.5 ${plan.popular ? "bg-gradient-to-r from-shield-mint to-emerald-300 text-slate-950 shadow-glow" : "border border-white/15 bg-white/5 text-white hover:border-shield-blue/60 hover:bg-shield-blue/10"}`
  }, plan.cta))))));
}
function Protocol() {
  return React.createElement("section", {
    id: "protocol",
    className: "mx-auto grid w-[min(100%_-_2rem,1160px)] gap-5 py-16 lg:grid-cols-[0.78fr_1.22fr]",
    "aria-labelledby": "protocol-title"
  }, React.createElement("div", {
    className: "rounded-3xl border border-white/10 bg-gradient-to-b from-[#122235]/95 to-[#0a1622]/90 p-7 shadow-card"
  }, React.createElement("p", {
    className: "mb-5 inline-flex items-center gap-2 rounded-full border border-shield-mint/25 bg-shield-mint/10 px-3 py-2 text-sm font-bold text-emerald-100"
  }, React.createElement("span", {
    className: "h-2.5 w-2.5 rounded-full bg-shield-mint shadow-[0_0_0_7px_rgba(54,226,143,0.13)]"
  }), "Fair-use protocol"), React.createElement("h2", {
    id: "protocol-title",
    className: "text-4xl font-black leading-tight text-white"
  }, "Protection works when card usage is verifiable."), React.createElement("p", {
    className: "mt-4 text-slate-400"
  }, "FuelShield prevents misuse by tying protection to verified Fuel Card transactions. That keeps plan pricing fair for drivers who use the service as intended.")), React.createElement("div", {
    className: "grid gap-4 md:grid-cols-2"
  }, protocolItems.map(([title, body]) => React.createElement("div", {
    key: title,
    className: "rounded-2xl border border-white/10 bg-white/[0.035] p-5"
  }, React.createElement("strong", {
    className: "block text-lg text-white"
  }, title), React.createElement("span", {
    className: "mt-2 block text-slate-400"
  }, body)))));
}
function Calculator({
  pumpPrice,
  setPumpPrice,
  protectedPrice,
  setProtectedPrice,
  coveredGallons,
  setCoveredGallons,
  estimate
}) {
  return React.createElement("section", {
    id: "calculator",
    className: "mx-auto w-[min(100%_-_2rem,1160px)] py-16",
    "aria-labelledby": "calculator-title"
  }, React.createElement(SectionHeading, {
    title: "Savings calculator"
  }, "Estimate monthly protection using your pump price, plan protected price, and covered gallons."), React.createElement("form", {
    className: "grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#122235]/95 to-[#0a1622]/90 p-6 shadow-card lg:grid-cols-[1fr_320px]",
    "aria-describedby": "calculator-help"
  }, React.createElement("div", null, React.createElement("div", {
    className: "grid gap-4 md:grid-cols-3"
  }, React.createElement(NumberField, {
    id: "pump-price",
    label: "Pump price per gallon",
    value: pumpPrice,
    onChange: setPumpPrice,
    step: "0.01"
  }), React.createElement(NumberField, {
    id: "protected-price",
    label: "Protected price per gallon",
    value: protectedPrice,
    onChange: setProtectedPrice,
    step: "0.01"
  }), React.createElement(NumberField, {
    id: "covered-gallons",
    label: "Covered gallons",
    value: coveredGallons,
    onChange: setCoveredGallons,
    step: "1"
  })), React.createElement("p", {
    id: "calculator-help",
    className: "mt-5 text-sm text-slate-400"
  }, "Formula: max(pump price - protected price, 0) x covered gallons. Actual reimbursements depend on eligibility, card usage, and your monthly cap.")), React.createElement("output", {
    className: "flex flex-col justify-center rounded-2xl border border-shield-mint/30 bg-gradient-to-br from-shield-mint/15 to-shield-blue/10 p-6"
  }, React.createElement("span", {
    className: "font-bold text-slate-300"
  }, "Estimated monthly protection"), React.createElement("span", {
    className: "my-2 text-5xl font-black leading-none text-shield-mint"
  }, currency.format(estimate.total)), React.createElement("span", {
    className: "text-sm text-slate-400"
  }, currency.format(estimate.spread), " protected spread across ", estimate.gallons.toLocaleString("en-US"), " gallons"))));
}
function NumberField({
  id,
  label,
  value,
  onChange,
  step
}) {
  return React.createElement("div", null, React.createElement("label", {
    htmlFor: id,
    className: "mb-2 block font-bold text-slate-200"
  }, label), React.createElement("input", {
    id: id,
    type: "number",
    min: "0",
    step: step,
    value: value,
    onChange: event => onChange(event.target.value),
    className: "min-h-[54px] w-full rounded-2xl border border-white/15 bg-black/25 px-4 text-white outline-none transition focus:border-shield-mint focus:ring-4 focus:ring-shield-mint/10"
  }));
}
function FAQ() {
  return React.createElement("section", {
    id: "faq",
    className: "mx-auto w-[min(100%_-_2rem,1160px)] py-16",
    "aria-labelledby": "faq-title"
  }, React.createElement(SectionHeading, {
    title: "FAQ"
  }, "Clear rules help drivers understand exactly when protection applies and where the monthly limits are."), React.createElement("div", {
    className: "grid gap-5 md:grid-cols-2"
  }, faqs.map(([question, answer]) => React.createElement("article", {
    key: question,
    className: "rounded-3xl border border-white/10 bg-gradient-to-b from-[#122235]/95 to-[#0a1622]/90 p-6 shadow-card transition hover:-translate-y-1 hover:border-shield-blue/40"
  }, React.createElement("h3", {
    className: "text-xl font-black text-white"
  }, question), React.createElement("p", {
    className: "mt-2 text-slate-400"
  }, answer)))));
}
function Waitlist({
  form,
  errors,
  submitted,
  updateField,
  submitWaitlist
}) {
  return React.createElement("section", {
    id: "waitlist",
    className: "mx-auto w-[min(100%_-_2rem,1160px)] py-16",
    "aria-labelledby": "waitlist-title"
  }, React.createElement("div", {
    className: "grid gap-8 rounded-[32px] border border-shield-mint/25 bg-gradient-to-br from-shield-mint/15 via-[#101e2d]/95 to-shield-blue/10 p-6 shadow-card lg:grid-cols-[0.9fr_1.1fr] lg:p-9"
  }, React.createElement("div", null, React.createElement("p", {
    className: "mb-5 inline-flex items-center gap-2 rounded-full border border-shield-mint/25 bg-shield-mint/10 px-3 py-2 text-sm font-bold text-emerald-100"
  }, React.createElement("span", {
    className: "h-2.5 w-2.5 rounded-full bg-shield-mint shadow-[0_0_0_7px_rgba(54,226,143,0.13)]"
  }), "Early access"), React.createElement("h2", {
    id: "waitlist-title",
    className: "text-4xl font-black leading-tight text-white lg:text-5xl"
  }, "Make fuel costs predictable."), React.createElement("p", {
    className: "mt-4 text-slate-300"
  }, "Join the FuelShield waitlist and tell us how much you usually drive. This demo validates locally and stores your entry in this browser only."), React.createElement("div", {
    className: "mt-7 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-slate-300"
  }, React.createElement("strong", {
    className: "block text-white"
  }, "Local demo behavior"), "No data is sent to a server. A successful entry is saved to localStorage as ", React.createElement("span", {
    className: "font-mono text-shield-mint"
  }, "fuelshield.waitlist"), ".")), React.createElement("form", {
    className: "grid gap-4",
    onSubmit: submitWaitlist,
    noValidate: true
  }, React.createElement(TextInput, {
    id: "name",
    name: "name",
    label: "Full name",
    value: form.name,
    onChange: updateField,
    error: errors.name,
    autoComplete: "name"
  }), React.createElement(TextInput, {
    id: "email",
    name: "email",
    type: "email",
    label: "Email address",
    value: form.email,
    onChange: updateField,
    error: errors.email,
    autoComplete: "email"
  }), React.createElement("div", {
    className: "grid gap-4 sm:grid-cols-2"
  }, React.createElement(TextInput, {
    id: "zip",
    name: "zip",
    label: "ZIP code",
    value: form.zip,
    onChange: updateField,
    error: errors.zip,
    autoComplete: "postal-code",
    inputMode: "numeric",
    maxLength: "5"
  }), React.createElement(TextInput, {
    id: "gallons",
    name: "gallons",
    type: "number",
    label: "Monthly gallons",
    value: form.gallons,
    onChange: updateField,
    error: errors.gallons,
    min: "10",
    max: "250"
  })), React.createElement("div", null, React.createElement("label", {
    htmlFor: "plan",
    className: "mb-2 block font-bold text-slate-200"
  }, "Preferred plan"), React.createElement("select", {
    id: "plan",
    name: "plan",
    value: form.plan,
    onChange: updateField,
    className: `min-h-[54px] w-full rounded-2xl border bg-black/25 px-4 text-white outline-none transition focus:border-shield-mint focus:ring-4 focus:ring-shield-mint/10 ${errors.plan ? "border-red-400" : "border-white/15"}`
  }, React.createElement("option", {
    className: "bg-slate-950",
    value: "Bronze"
  }, "Bronze"), React.createElement("option", {
    className: "bg-slate-950",
    value: "Silver"
  }, "Silver"), React.createElement("option", {
    className: "bg-slate-950",
    value: "Gold"
  }, "Gold")), errors.plan && React.createElement("p", {
    className: "mt-2 text-sm font-semibold text-red-300"
  }, errors.plan)), React.createElement("button", {
    type: "submit",
    className: "mt-2 rounded-full bg-gradient-to-r from-shield-mint to-emerald-300 px-6 py-4 font-black text-slate-950 shadow-glow transition hover:-translate-y-0.5"
  }, "Request Early Access"), submitted && React.createElement("p", {
    className: "rounded-2xl border border-shield-mint/35 bg-shield-mint/10 p-4 text-sm font-semibold text-emerald-100",
    role: "status"
  }, "You're on the list. FuelShield saved this waitlist entry locally for the demo."))));
}
function TextInput({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  ...props
}) {
  return React.createElement("div", null, React.createElement("label", {
    htmlFor: id,
    className: "mb-2 block font-bold text-slate-200"
  }, label), React.createElement("input", {
    id: id,
    name: name,
    type: type,
    value: value,
    onChange: onChange,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
    className: `min-h-[54px] w-full rounded-2xl border bg-black/25 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-shield-mint focus:ring-4 focus:ring-shield-mint/10 ${error ? "border-red-400" : "border-white/15"}`,
    ...props
  }), error && React.createElement("p", {
    id: `${id}-error`,
    className: "mt-2 text-sm font-semibold text-red-300"
  }, error));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
