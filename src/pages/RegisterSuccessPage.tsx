import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Home } from "lucide-react";

export function RegisterSuccessPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center py-24 md:py-32 bg-gradient-to-b from-cream to-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl px-5 md:px-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-50 border border-gold-200 mb-8">
          <CheckCircle2 size={40} className="text-gold-600" aria-hidden="true" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal mb-6">
          Thank You for Registering
        </h1>

        <div className="rounded-3xl bg-white p-8 md:p-10 card-border premium-shadow-lg text-left space-y-4">
          <p className="text-warm-gray leading-relaxed">
            Thank you for registering for Vinootana Golden Singers.
          </p>
          <p className="text-warm-gray leading-relaxed">
            Your application has been successfully submitted.
          </p>
          <p className="text-warm-gray leading-relaxed">
            Our team will review your profile and audition materials.
          </p>
          <p className="text-charcoal font-medium leading-relaxed">
            Selected participants will be contacted through the registered phone
            number or email.
          </p>
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          <Home size={18} aria-hidden="true" />
          Return to Home
        </Link>
      </motion.div>
    </section>
  );
}
