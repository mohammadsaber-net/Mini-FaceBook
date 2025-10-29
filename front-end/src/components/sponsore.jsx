import { assets } from "../assets/assets.js"
export default function Sponsore() {
  return (
    <div className="text-center mt-20 sm:mt-4 min-h-[calc(100vh-115px)] bg-gray-100 sm:mt-4">
        <div className="max-w-xs text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
        <h1 className="text-shadow-teal-800 font-semibold">sponsored</h1>
        <img src={assets.sponsored_img} className="w-75
        h-50 rounded-md" alt="" />
        <p className="text-slate-600">Email marketing</p>
        <p className="text-slate-400">upcharge your marketing with a powerful , easy to use platform built for results.</p>
    </div>
    </div>
  )
}
