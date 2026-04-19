"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { Logo } from "../components/layout/Logo";
// import {
//   extractResumeData,
//   parseJobDescription,
//   tailorResumeToJob,
//   generateId,
// } from "../utils/mockAnalysis";
// import { saveToHistory } from "../utils/storage";

export default function HomePage() {
  const [fileName, setFileName] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   setFileName(file.name);
    // }
  };

  const handleSubmit = async () => {
    // if (!fileName || !jobInput.trim()) return;
    // setIsProcessing(true);
    // // Simulate processing delay
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // // Mock extraction and tailoring
    // const resumeData = extractResumeData(fileName);
    // const jobData = parseJobDescription(jobInput);
    // const tailored = tailorResumeToJob(resumeData, jobData);
    // const result = {
    //   ...tailored,
    //   id: generateId(),
    //   createdAt: new Date().toISOString(),
    //   jobTitle: jobData.title,
    //   companyName: jobData.company,
    // };
    // saveToHistory(result);
    // navigate(`/results/${result.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 m-8">
      {/* Logo and Header Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="text-emerald-400">
            <Logo className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-100">
              Resume Optimization Pipeline
            </h1>
            <p className="text-slate-400 mt-1">
              v2.4.1 · Neural tailoring engine
            </p>
          </div>
        </div>
        
        {/* Steps for use */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              step: "01",
              title: "Data Extraction",
              desc: "Parse resume structure and extract entities",
            },
            {
              step: "02",
              title: "Semantic Analysis",
              desc: "Compute job-resume alignment score",
            },
            {
              step: "03",
              title: "Output Generation",
              desc: "Generate tailored resume and questions",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className="p-6 bg-slate-800/30 border-slate-700">
                <div className="space-y-2">
                  <div className="text-emerald-400 font-mono text-xs">
                    STEP {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-200">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* System Instructions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h2 className="text-sm font-mono text-emerald-400 uppercase tracking-wider">
            System Instructions
          </h2>
          <div className="space-y-2 text-sm text-slate-300 font-mono leading-relaxed">
            <p>
              <span className="text-slate-500">01.</span> Upload resume document
              (PDF/DOC/DOCX format)
            </p>
            <p>
              <span className="text-slate-500">02.</span> Paste target job
              description or posting URL
            </p>
            <p>
              <span className="text-slate-500">03.</span> Engine will extract
              structured data, compute relevance metrics
            </p>
            <p>
              <span className="text-slate-500">04.</span> Generates optimized
              resume variant + interview question set
            </p>
          </div>
        </div>
      </motion.div>

      {/* Input Fields */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 space-y-6 bg-slate-800/50 border-slate-700">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">
              Resume Document
            </label>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-700/30 transition-colors border-slate-600 bg-slate-900/30">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {fileName ? (
                    <div className="text-center">
                      <p className="text-sm text-emerald-400 font-medium font-mono">
                        {fileName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Click to replace
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-400 font-mono">
                        Click to select file
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Accepts: PDF, DOC, DOCX
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </label>
            </motion.div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">
              Target Job Description
            </label>
            <Textarea
              placeholder="Paste job description text or URL..."
              className="min-h-[200px] resize-none bg-slate-900/30 border-slate-600 text-slate-100 font-mono text-sm"
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSubmit}
              disabled={!fileName || !jobInput.trim() || isProcessing}
              className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 font-mono uppercase tracking-wide"
            >
              {isProcessing ? "Processing..." : "Execute Optimization"}
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
