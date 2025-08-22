import { useEffect, useState } from "react";


const SingleComment = (prop) => {

    const comment = prop.comment;

    const [from, setFrom] = useState('');

    useEffect(()=>{
        console.log('comment', comment);
        const fetchFrom = async() => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/profile/${comment.from}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type':'application/json'
                    }
                })

                const data = await res.json();

                if(res.ok) {
                    setFrom(data.profile.name);
                }
            } catch (err) {
                console.log(data['message']);
                console.log(data);
            }
        }
        fetchFrom();
    },[])

  return (
    <div>
        <li 
          key={comment} 
          className="bg-gray-50 p-3 rounded-md mb-2 border border-gray-100">

            <strong className="text-gray-800">{from || "Unknown"}:</strong>{' '}
            <span className="text-gray-700">{comment.message}</span>
            <span className="text-gray-500 text-xs ml-2">
              • {new Date(comment.createdAt).toLocaleString()}
            </span>

        </li>
    </div>
  )
}

export default SingleComment