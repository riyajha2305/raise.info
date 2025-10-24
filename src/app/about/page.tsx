import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="/icon.png" 
                  alt="Salaris.fyi Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold text-slate-700 cursor-pointer hover:text-slate-800 transition-colors">
                salaris.fyi
              </h1>
            </Link>
            <p className="text-lg text-slate-600">
              Discover salary insights across various companies
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent mb-6">
            About Us
          </h2>

          <div className="space-y-6 text-gray-700">
            <p className="text-lg leading-relaxed">
              Welcome to{" "}
              <span className="font-semibold text-slate-600">salaris.fyi</span>,
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
                  <div className="w-12 h-12 rounded-full bg-slate-500 flex items-center justify-center text-white font-bold text-lg">
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
                      className="text-sm text-slate-600 hover:text-slate-700 flex items-center gap-1 transition-colors"
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
                  <div className="w-12 h-12 rounded-full bg-slate-500 flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Saswat Samal</p>
                    <a
                      href="https://www.linkedin.com/in/saswatsam/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 hover:text-slate-700 flex items-center gap-1 transition-colors"
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
                className="inline-block bg-slate-500 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-medium"
              >
                Explore Salary Data
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
