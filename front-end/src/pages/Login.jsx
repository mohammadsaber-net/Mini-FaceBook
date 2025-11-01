import { useState } from "react";
import { Star } from "lucide-react";
import { assets } from "../assets/assets.js";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { FaFacebook } from "react-icons/fa";

function Login() {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 mx-auto py-5 p-2 h-screen relative">
      <div className="flex md:flex-col justify-between flex-row p-5">
        <div>
          <FaFacebook className="text-blue-600 relative size-8 md:size-12" />
        </div>

        <div className="flex justify-between md:my-auto flex-col">
          <div>
            <img
              loading="lazy"
              src={assets.group_users}
              alt="group_users"
              className="h-6 object-contain sm:h-12"
            />
          </div>

          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star key={i} className="text-transparent fill-amber-400" />
              ))}
          </div>
          <p>
            Used by 12k+ developers
          </p>

          <h1 className="bg-gradient-to-r bg-clip-text max-w-64 md:max-w-full font-bold text-transparent from-indigo-950 to-indigo-800 md:text-3xl">
            More than friends — truly connect
          </h1>
        </div>
      </div>
      <div className="m-auto">
          <SignIn signUpUrl="/sign-up" />
      </div>
    </div>
  );
}

export default Login;



// import {Star } from "lucide-react"
// import {assets} from "../assets/assets.js"
// import { SignIn, SignUp} from "@clerk/clerk-react"
// import { FaFacebook } from "react-icons/fa";
// import { useLocation } from "react-router-dom";
// function Login(){
//     const location = useLocation();
//   const isSignUp = location.pathname === "/sign-up";
//     return(
//         <div>
//             <div className="flex container flex-col md:flex-row mx-auto py-5 min-h-screen">
//                 <img loading="lazy" src={assets.bgImage} alt="bgImage" className="absolute top-0 -z-10 left-0 w-full"/>
//                 <div className="flex md:flex-col justify-between flex-row">
//                     <div className="">
//                         <FaFacebook className="text-blue-600 relative size-8 md:size-12" />

//                         {/* <img src={assets.logo} alt="logo" className="h-6 object-contain sm:h-12"/> */}
//                     </div>
//                     <div className="flex justify-between md:my-auto flex-col">
//                         <div>
//                         <img loading="lazy" src={assets.group_users} alt="group_users" className="h-6 object-contain sm:h-12"/>
//                         </div>
//                         <div>
//                             <div className="flex">
//                                 {Array(5).fill(0).map((_,i)=><span key={i}><Star className="text-transparent fill-amber-400" /></span>)}
//                             </div>
//                             <p className="">Used by 12k+ developers</p>
//                         </div>
//                     <h1 className="bg-gradient-to-r bg-clip-text max-w-64 md:max-w-full font-bold text-transparent  from-indigo-950 to-indigo-800 md:text-3xl">
//                         more just friends truly connect
//                     </h1>
//                     </div>
//                 </div>
//                 <div className="m-auto">
//                     {isSignUp ? (
//                         <SignUp routing="path" path="/sign-up" />
//                     ) : (
//                         <SignIn routing="path" path="/sign-in" />
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Login