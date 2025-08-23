import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/config";


const SingleConnection2 = (prop) => {

    const conn = prop.connection;

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
        const fetchData = async() => {
            try {
                const res = await fetch(`${API_URL}/api/user/profile/${conn}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });

                const data = await res.json();

                if(res.ok) {
                    setUser(data['profile']);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    },[])

  return (
    <div key={conn} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
        <Link to={`/users/${conn}`} key={conn} className="bg-white p-4 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-200">
            <img
              src={user.profilePic || `https://placehold.co/50x50/e2e8f0/4a5568?text=${user.name.charAt(0).toUpperCase()}`}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-300"
            />
            <div>
                <h4 className="font-medium text-gray-800">{user.name}</h4>
                <p className="text-gray-500 text-sm">{user.userStatus || 'No status'}</p>
            </div>
        </Link>
    </div>
  )
}

export default SingleConnection2