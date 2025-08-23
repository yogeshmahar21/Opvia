import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/config";


const SingleConnection = (prop) => {

    const req = prop.request;
    const id = prop.receiver;

    const [user, setUser] = useState({
    _id:'',
    name:'',
    userStatus:'',
    skills:'',
    postedJobIds:[],
    connectionsIds:[],
    connectionReqIds:[],
    AppliedJobIds: [],
    postIds:[],
    profilePic:''
  });

    useEffect(() => {
        console.log('reqID', req);
        console.log('id', id);
        const fetchData = async() => {
            try {
                const res = await fetch(`${API_URL}/api/user/profile/${req}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });

                const data = await res.json();

                if(res.ok) {
                    setUser(data['profile']);
                    console.log('From Single',data['profile']);
                    console.log('From Single 2',data);
                } else {
                  alert(data['message']);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
        console.log(req);
    },[]);


    const handleAcceptRequest = async () => {
    try {

      try {
        const res = await fetch(`${API_URL}/api/user/profile/connection/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            id : req
          })
        });

        const data = await res.json();

        if(res.ok) {
          alert('Connected');
          console.log(data);
        } else {
          alert(data['message']);
          console.log(data);
        }
      } catch (err) {
        console.error(err);
      }

      setTimeout(()=>{
        window.location.reload();
      },2000); // Simple reload for now, or refine fetchConnectionsData
    } catch (err) {
      console.error('Error accepting connection:', err);
      alert('Failed to accept connection.');
    }
  };

  return (
    <div key={req} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
        <Link to={`/users/${req}`} className="flex items-center">
        <img
        src={user.profilePic || `https://placehold.co/40x40/cbd5e1/475569?text=${user.name.charAt(0).toUpperCase()}`}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-300"
        />
        <span className="font-medium text-gray-800 hover:text-blue-600">{user.name}</span>
        </Link>
        <button
        onClick={handleAcceptRequest}
        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md transition-colors duration-200"
        >
            Accept
        </button>
    </div>
  )
}

export default SingleConnection