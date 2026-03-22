// Resume Bileşeni

export function ResumeSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-start p-10 md:p-32 w-full">
      <div className="w-full max-w-5xl pointer-events-auto">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-indigo-500 mb-3">
          About & Experience
        </p>
        <h2 className="text-4xl font-bold text-slate-900 mb-12">
          Resume
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol Kolon: Summary & Eğitim */}
          <div className="lg:col-span-1 space-y-10">
            {/* Summary */}
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-white/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Summary</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Computer Engineering graduate (Ranked 2nd in Dept, 3rd in Faculty) with a strong foundation in Data Mining & ML projects.
                Proficient in building ETL pipelines using Azure Data Factory, managing MDM processes, and supporting data governance.
                Combines data engineering expertise with C/Java programming, Shell scripting, and Linux system management for robust solutions.
              </p>
            </div>

            {/* Education */}
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-white/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Education</h3>
              <div className="mb-6">
                <p className="font-semibold text-slate-900">B.Sc. Computer Engineering</p>
                <p className="text-indigo-600 text-sm mb-1">Kocaeli University | 2021-2025</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  GPA: 3.77 (High Honor). Thesis: AI-based meeting transcription/summarization system.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Software Engineering Intensive</p>
                <p className="text-indigo-600 text-sm mb-1">42 Kocaeli | 2021-2023</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  C, Shell, Linux system administration. Peer-learning & project-based.
                </p>
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-white/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Certificates</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <span className="font-semibold text-slate-900 block">AI Specialist Certification</span>
                  National Technology Academy (Ministry of Tech)
                </li>
                <li>
                  <span className="font-semibold text-slate-900 block">AZ-900</span>
                  Microsoft Certified - Azure Fundamentals
                </li>
              </ul>
            </div>
          </div>

          {/* Sağ Kolon: İş Deneyimi */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Experience</h3>

            {/* Gunvor */}
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Data Engineer Trainee</h4>
                  <p className="text-indigo-600 font-medium">Gunvor Group</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full mt-2 md:mt-0 w-max">
                  July 2025 - Present
                </span>
              </div>
              <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-slate-600 leading-relaxed">
                <li>Designed and maintained scalable ETL pipelines using <b>Azure Data Factory</b>.</li>
                <li>Delivered enterprise <b>Master Data Management (MDM)</b> solutions using Profisee (golden record, entity matching).</li>
                <li>Managed deployments across Dev/UAT/Prod using <b>Azure DevOps</b>.</li>
                <li>Leveraged Azure Blob Storage, Key Vault, and Power BI for enterprise workflows.</li>
                <li>Cross-functional collaboration in Agile/Scrum environment with System, InfoSec, and Cloud teams.</li>
              </ul>
            </div>

            {/* Tubitak */}
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Researcher Assistant</h4>
                  <p className="text-indigo-600 font-medium">Tubitak Marmara Research Center</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full mt-2 md:mt-0 w-max">
                  Mar 2024 - Sep 2024
                </span>
              </div>
              <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-slate-600 leading-relaxed">
                <li>Conducted environmental research using RGB color space analysis for water contamination.</li>
                <li>Leveraged <b>Deep Learning</b> for root cause analysis on image data.</li>
                <li>Developed and optimized robust Python/Shell scripts for data processing.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
