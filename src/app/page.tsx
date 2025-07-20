import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Deepsight</h1>
          <p className="text-slate-600">Trading analysis dashboard</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Trading Journal</h2>
              <p className="text-sm text-slate-500">Track and analyze your trades</p>
            </div>
          </div>
          
          <Link 
            href="/trading"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-3 font-medium text-center block transition-colors duration-200"
          >
            Launch Trading App
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Your comprehensive trading analysis toolkit
          </p>
        </div>
      </div>
    </div>
  );
}
