// src/pages/OnboardingWizard.jsx
import React, { useState } from "react";
import api from "../api";
import AvatarUploader from "../components/AvatarUploader";
import Button from "../components/Button";
import Input from "../components/Input";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [profilePic, setProfilePic] = useState(null);
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const finish = async () => {
    // NOTE: if you support file upload, switch this to FormData
    try {
      await api.put("/api/users/me", {
        about,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience,
        education,
        // profilePic: <upload first, then save URL>
      });
      window.location.href = "/dashboard";
    } catch {
      alert("Failed to save onboarding");
    }
  };

  return (
    <div>
      <h2>Onboarding</h2>
      {step === 1 && (
        <div>
          <h3>Upload Photo</h3>
          <AvatarUploader onFileSelected={setProfilePic} />
          <Button onClick={next}>Next</Button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>About & Skills</h3>
          <textarea placeholder="About you" value={about} onChange={(e) => setAbout(e.target.value)} />
          <Input placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
          <div>
            <Button onClick={back}>Back</Button>{" "}
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <h3>Experience</h3>
          <textarea placeholder="Work experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <div>
            <Button onClick={back}>Back</Button>{" "}
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div>
          <h3>Education</h3>
          <textarea placeholder="Education" value={education} onChange={(e) => setEducation(e.target.value)} />
          <div>
            <Button onClick={back}>Back</Button>{" "}
            <Button onClick={finish}>Finish</Button>
          </div>
        </div>
      )}
    </div>
  );
}
