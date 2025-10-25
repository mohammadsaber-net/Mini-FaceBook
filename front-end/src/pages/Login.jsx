import {Star } from "lucide-react"
import {assets} from "../assets/assets.js"
import { SignIn} from "@clerk/clerk-react"
import { FaFacebook } from "react-icons/fa";
function Login(){
    return(
        <div>
            <div className="flex container flex-col md:flex-row mx-auto py-5 min-h-screen">
                <img loading="lazy" src={assets.bgImage} alt="bgImage" className="absolute top-0 -z-10 left-0 w-full"/>
                <div className="flex md:flex-col justify-between flex-row">
                    <div className="">
                        <FaFacebook className="text-blue-600 relative size-8 md:size-12" />

                        {/* <img src={assets.logo} alt="logo" className="h-6 object-contain sm:h-12"/> */}
                    </div>
                    <div className="flex justify-between md:my-auto flex-col">
                        <div>
                        <img loading="lazy" src={assets.group_users} alt="group_users" className="h-6 object-contain sm:h-12"/>
                        </div>
                        <div>
                            <div className="flex">
                                {Array(5).fill(0).map((_,i)=><span key={i}><Star className="text-transparent fill-amber-400" /></span>)}
                            </div>
                            <p className="">Used by 12k+ developers</p>
                        </div>
                    <h1 className="bg-gradient-to-r bg-clip-text max-w-64 md:max-w-full font-bold text-transparent  from-indigo-950 to-indigo-800 md:text-3xl">
                        more just friends truly connect
                    </h1>
                    </div>
                </div>
                <div className="m-auto">
                    <SignIn />
                </div>
            </div>
        </div>
    )
}
export default Login