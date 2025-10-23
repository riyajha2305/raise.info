import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Header */}
      <header className="bg-[#80A1BA] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <Link href="/">
              <h1 className="text-4xl font-bold text-[#F0F0F0] mb-2 cursor-pointer hover:opacity-80 transition-opacity">
                salaris.fyi
              </h1>
            </Link>
            <p className="text-lg text-[#F0F0F0]">
              Discover salary insights across various companies
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#80A1BA] to-[#5A7A8A] bg-clip-text text-transparent mb-6">
            About Us
          </h2>

          <div className="space-y-6 text-gray-700">
            <p className="text-lg leading-relaxed">
              Welcome to{" "}
              <span className="font-semibold text-[#80A1BA]">salaris.fyi</span>,
              your trusted source for salary insights and compensation data
              across top companies.
            </p>

            <p className="leading-relaxed">
              We believe in transparency when it comes to compensation. Our
              platform aggregates and presents salary information to help
              professionals make informed career decisions, negotiate better
              offers, and understand their market value.
            </p>

            <div className="pt-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Our Mission
              </h3>
              <p className="leading-relaxed">
                To empower professionals with accurate, comprehensive salary
                data that promotes fair compensation and informed career
                decisions across the tech industry.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Meet the Team
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Team Member 1 */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#80A1BA] flex items-center justify-center text-white font-bold text-lg">
                    R
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Riya Kumari Jha
                    </p>
                    <a
                      href="https://www.linkedin.com/in/riya-jha-7b4774210/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#80A1BA] hover:text-[#6B8BA0] flex items-center gap-1 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>

                {/* Team Member 2 */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#80A1BA] flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Saswat Samal</p>
                    <a
                      href="https://www.linkedin.com/in/saswatsam/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#80A1BA] hover:text-[#6B8BA0] flex items-center gap-1 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/"
                className="inline-block bg-[#80A1BA] text-white px-6 py-3 rounded-md hover:bg-[#6B8BA0] transition-colors font-medium"
              >
                Explore Salary Data
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#80A1BA] border-t border-[#6B8BA0] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[#F0F0F0] text-sm">
              © 2024 salaris.fyi. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                href="/"
                className="text-[#F0F0F0] hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link href="/about" className="text-[#F0F0F0] font-medium hover:text-white transition-colors">
                About
              </Link>
              <Link
                href="/contact"
                className="text-[#F0F0F0] hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
