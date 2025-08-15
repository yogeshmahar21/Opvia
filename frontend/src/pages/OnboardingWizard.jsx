import { useState } from "react";
import { api } from "../api/client";

export default function OnboardingWizard() {
  const token = localStorage.getItem("token");
  const [step,setStep]=useState(1);
  const [data,setData]=useState({ profilePic:"", skills:[], experience:[], education:[] });

  const next=()=>setStep(s=>s+1); const back=()=>setStep(s=>Math.max(1,s-1));
  const save=async()=>{ await api(token).post(`/api/users/${"me"}/settings`, { /* optional */ });
    await api(token).post(`/api/users/${"me"}`, data, "PUT");
    alert("Onboarding complete");
  };

  return (<div>
    <h2>Onboarding</h2>
    {step===1 && (<div>
      <input placeholder="Profile Pic URL" value={data.profilePic} onChange={e=>setData({...data, profilePic:e.target.value})}/>
      <button onClick={next}>Next</button>
    </div>)}
    {step===2 && (<div>
      <input placeholder="Add skill and press Enter" onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault(); setData({...data, skills:[...data.skills, e.currentTarget.value]}); e.currentTarget.value="";}}}/>
      <p>{data.skills.join(", ")}</p>
      <button onClick={back}>Back</button><button onClick={next}>Next</button>
    </div>)}
    {step===3 && (<div>
      <textarea placeholder="Experience JSON (quick demo)" onChange={e=>setData({...data, experience:JSON.parse(e.target.value||"[]")})}/>
      <button onClick={back}>Back</button><button onClick={save}>Finish</button>
    </div>)}
  </div>);
}
