import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";


 
export default function Contact() {
  // Form input state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Submission status state
  const [submitted, setSubmitted] = useState(false);

  // Helper to handle text changes on any input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in the required fields: Name, Email, and Message.");
      return;
    }

    // Set submitted to true to show thank-you message
    setSubmitted(true);

    // Reset the form values
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const contactDetails = [
    {
      icon: MapPin,
      title: "Our Address",
      line1: "123 Foodie Avenue, Connaught Place",
      line2: "New Delhi, 110001, India",
    },
    {
      icon: Phone,
      title: "Call Us",
      line1: "+91 98765 43210",
      line2: "+91 11 2345 6789",
    },
    {
      icon: Mail,
      title: "Email Us",
      line1: "hello@tastepoint.com",
      line2: "reservations@tastepoint.com",
    },
    {
      icon: Clock,
      title: "Working Hours",
      line1: "Monday - Friday: 11:00 AM - 11:00 PM",
      line2: "Saturday - Sunday: 10:30 AM - 11:30 PM",
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Banner */}
      <section className="bg-[#17191d] py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
            Get In Touch
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Contact <span className="text-brand-orange">TastePoint</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-300 sm:text-lg">
            Have a question, feedback, or want to book a table for a celebration? Send us a message or visit us in person!
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="px-5 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
          {/* Left Column: Contact Cards */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
                Let's Start a Conversation
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Reach out to us through any of the channels below or fill out the form. We respond within a few hours!
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactDetails.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:bg-orange-50/50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-brand-orange">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{item.line1}</p>
                      <p className="text-sm text-gray-600">{item.line2}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg sm:p-10">
              <h2 className="text-2xl font-black text-gray-900">
                Send Us a Message
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Fields marked with <span className="text-red-500">*</span> are required.
              </p>

              {/* Success Notification after submission */}
              {submitted && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
                  <CheckCircle2 size={22} className="shrink-0 text-green-600" />
                  <div>
                    <p className="font-bold">Thank you for contacting us!</p>
                    <p className="mt-1 text-sm text-green-700">
                      Your message has been received. Our team will get back to you shortly.
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="e.g. Table Reservation / General Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Write your message, feedback, or reservation details here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 active:scale-95"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
