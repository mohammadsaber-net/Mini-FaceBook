import { useAuth } from '@clerk/clerk-react'
import { Image, ThumbsUp, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Link} from 'react-router-dom'

export default function LeaveComment({postId,comments}) {
  const [comment, setComment] = useState("")
  const user=useSelector(state=>state.user?.user)
  const [image, setImage] = useState([])
  const [commentsList, setCommentsList] = useState(comments || [])
  const [loading, setLoading] = useState(false)
  const {getToken}=useAuth()
  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)
        if(image.length<=0 && !comment){
            return toast.error("please add at least one image or text")
        }else{
            const typeComment=image.length > 0&&comment?"image_with_text":image.length>0?"image":"text"
        try {
            const formData=new FormData()
            formData.append("content",comment)
            formData.append("postId",postId)
            formData.append("type_comment",typeComment)
            image.map(img=>{
                formData.append("image",img)
            })
            const {data}=await api.post("/api/comment/add",formData,{
                headers:{Authorization:`Bearer ${await getToken()}`}
            })
            if(data.success){
                setComment("")
                setImage([])
                setCommentsList([data.comment, ...commentsList])
                toast.success("comment added")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        }
        setLoading(false)
  }
  
  const handleLikes = async (commentId) => {
  try {
    const { data } = await api.post("/api/comment/like", { commentId }, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });

    if (data.success) {
      toast.success(data.message);
      setCommentsList(prev =>
        prev.map(comment => (comment._id === data.comment._id ? data.comment : comment))
      );
    }
  } catch (error) {
    toast.error(error.message);
  }
};
  return (
    <form className='bg-white w-full text-right' onSubmit={handleSubmit}>
      <div className='flex justify-center me-0 ms-auto w-80 border rounded-lg border-gray-300 items-center'>
        <div className='flex justify-center w-full flex-col-reverse'>
            <textarea className='resize-none focus:outline-none' placeholder='Leave a comment...' value={comment} onChange={(e) => setComment(e.target.value)}/>
            {
            image.length > 0 && <div className="flex flex-wrap gap-2 p-2">
                {
                image.map((img,index)=>(
                <div key={index} className="relative group">
                    <img src={URL.createObjectURL(img)} className="h-20 rounded-md" alt="" />
                        <div className="absolute hidden group-hover:flex justify-center items-center top-0 left-0 right-0 bottom-0 bg-black/40 rounded-md cursor-pointer" onClick={()=>setImage(image.filter((_,i)=>i !== index))}>
                           <X className="text-white"/>
                            </div>
                         </div>
                 ))
                }
            </div>
            }
        </div>
       <label htmlFor="images" className="flex items-center border-s border-gray-200 justify-center w-20 h-12 text-sm text-green-500 hover:text-green-600 transition cursor-pointer">
        <Image className="size-6 "/>  
        </label>
        <input type="file" id="images" accept="image/*" hidden multiple onChange={(e)=>setImage([...image,...e.target.files])}/>             
      </div>
        <button className={`bg-blue-500 mb-2 text-white px-4 ms-auto me-0 mt-4 block w-fit py-2 rounded-lg ${comment.trim().length === 0 && image.length === 0? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}`} type='submit' disabled={loading}>{loading?"Loading...":"Submit"}</button>
      <div className='border-t border-gray-200'>
        <h3>Recent Comments</h3>
        {
          commentsList.map(comment => (
        
              <div key={comment._id} className='border-b border-gray-200 p-2'>
              <div className='flex items-center justify-between'>
                <Link to={`/profile/${comment.user?._id}`} className='flex items-center gap-2'>
                  <img src={comment.user?.profile_picture} alt="" className='w-8 h-8 rounded-full'/>
                  <span className='text-sm font-semibold'>{comment.user?.full_name}</span>
                </Link>
              <div>
                  <div className='flex w-64 gap-2 flex-wrap p-2'>
                {comment.image_url?.length> 0&&comment.image_url.map((img,index)=> (
                    <img src={img} alt="" className='w-28 h-28 object-cover rounded-lg' />
                ))}
                </div>
                <p className='text-sm text-gray-700'>{comment.content}</p>
              </div>
              </div>
              <small className='text-xm text-gray-500'>{moment(comment.createdAt).fromNow()}</small>
              <div onClick={()=>handleLikes(comment)} className="flex justify-end items-center text-gray-500 cursor-pointer text-xm text-right gap-2.5">
                 Like <ThumbsUp className={`${comment.likes_count.includes(user?._id) ? "text-blue-500 fill-current" : ""}`} /> {
                  <span>{comment.likes_count.length || 0}</span>
                 }
            </div>
            </div>
          ))
        }
      </div>
    </form>
  )
}
