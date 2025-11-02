import RecentMessage from "../components/RecentMessage.jsx"
function Message(){
    return(
        <div className="relative mt-16 bg-white sm:mt-4 min-h-[calc(100vh-55px)] pb-8">
            <div className="max-w-6xl mx-auto p-2">
                    <h3 className='md:text-lg text-base font-semibold text-slate-800'>Recent Messages</h3>
                    <RecentMessage />
                </div>
        </div>
    )
}
export default Message