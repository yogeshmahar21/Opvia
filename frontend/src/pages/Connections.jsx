// src/pages/Connections.jsx
import React, { useEffect, useState } from 'react';
import SingleConnection from '../components/SingleConnection';
import SingleConnection2 from '../components/SingleConnection2';
import { useNavigate } from 'react-router-dom';

export default function Connections({ currentUserId, currentUserProfileId }) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState({
    _id:'',
    name:'',
    userStatus:'',
    skills:'',
    postedJobIds:[],
    connectionIds:[],
    connectionReqIds:[],
    AppliedJobIds: [],
    postIds:[],
    profilePic:'',
    suggestedUsers: []
  });

  const [searchName, setSearchName] = useState('');
  // const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(()=>{
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization' : `Bearer ${token}`
          },
        });

        const data = await res.json();
        console.log('data', data);

        if(res.ok) {
          setLoading(false);  
          setUserProfile(data['profile']);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserProfile();
  },[]);

  // useEffect(()=>{

  // })

  const handleAcceptRequest = async (requesterProfileId) => {
    if (!userProfile._id) {
      alert("Your profile ID is missing. Cannot accept request.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/user/profile/connection/${userProfile._id}`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          id : requesterProfileId
        })
      });

      const data = await res.json();

      if(res.ok) {
        alert('Connected');
        console.log(data);
      }
      setTimeout(()=> window.location.reload(),2000);
    } catch (err) {
      console.error('Error accepting connection:', err);
      alert('Failed to accept connection.');
    }
  };

  if (loading) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-600">Loading connections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  const addSuggessetion = async(SArray) => {
    try {
      const res = await fetch('http://localhost:5000/api/user/profile/add/suggested/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId : userProfile._id,
          suggesstions : SArray
        })
      });

      if(res.ok) {
        const data = await res.json();
        console.log(data);
      }
    } catch (err) {
      console.err(err);
    }
  }

  const HandleSearchConnection = async () => {
    let userId;
    try {
      const res = await fetch('http://localhost:5000/api/user/profile/getAllProfiles', {
        method: 'GET',
        headers: {
          'Accept':'application/json'
        }
      });

      if(res.ok) {
        const data = await res.json();
        console.log(data);
        const foundProfile = data["userProfiles"].find(
          (profile) => profile.name === searchName
        );

        if(foundProfile) {
          userId = foundProfile._id;
          addSuggessetion(foundProfile.connectionIds);
          navigate(`/users/${userId}`);
        } else {
        alert(`No user exists with name "${searchName}"`);
        }
        
      } else {
        console.error('res is not ok');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Connections</h2>

      {/* Connection Requests Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Connection Requests ({userProfile.connectionReqIds.length})</h3>
        {userProfile.connectionReqIds.length === 0 ? (
          <p className="text-gray-600">No new connection requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProfile.connectionReqIds.map((req) => (
              <SingleConnection request={req} receiver={userProfile._id} key={req}/>  
            ))}
          </div>
        )}
      </section>

      {/* My Connections Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Connections ({userProfile.connectionIds.length})</h3>
        {userProfile.connectionIds.length === 0 ? (
          <p className="text-gray-600">You don't have any connections yet. Start by sending requests to others!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProfile.connectionIds.map((conn) => (
              <SingleConnection2 connection={conn} key={conn} />
            ))}
          </div>
        )}
      </section>

      {/* Search Users Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Find New Connections</h3>
        <div className="flex mb-6 w-full max-w-lg">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-1 h-10 border border-gray-300 rounded-l-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="h-10 px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            onClick={HandleSearchConnection}
          >
          Search
          </button>
        </div>


        {/* Suggested Users */}
        <div>
          <h4 className="text-xl font-semibold text-gray-700 mb-4">Suggested Users</h4>
          {userProfile.suggestedUsers.length === 0 ? (
            <p className="text-gray-600">No suggestions at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProfile.suggestedUsers.map((user) => (
                <SingleConnection2 connection={user} key={user} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
