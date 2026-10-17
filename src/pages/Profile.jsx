import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  Sparkles,
  Save,
  CheckCircle2,
  Plus,
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import SkillBadge from '../components/SkillBadge';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Aarav Sharma',
    email: user?.email || 'aarav.sharma@example.com',
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Bengaluru, India',
    title: user?.title || 'Final Year B.Tech CSE Student & Aspiring Software Engineer',
    university: user?.education?.university || 'National Institute of Technology (NIT)',
    degree: user?.education?.degree || 'B.Tech in Computer Science & Engineering',
    graduationYear: user?.education?.graduationYear || '2026',
    github: user?.socialLinks?.github || 'https://github.com/aaravsharma-dev',
    linkedin: user?.socialLinks?.linkedin || 'https://linkedin.com/in/aarav-sharma-tech',
    portfolio: user?.socialLinks?.portfolio || 'https://aaravsharma.dev',
  });

  const [skills, setSkills] = useState(
    user?.skills || [
      'JavaScript (ES6+)',
      'React.js',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Docker',
      'Data Structures',
      'Tailwind CSS',
    ]
  );
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        title: formData.title,
        education: {
          university: formData.university,
          degree: formData.degree,
          graduationYear: formData.graduationYear,
        },
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
        },
        skills,
      };

      const res = await updateProfile(payload);
      const data = res.data || res;
      setUser(data);
      toast.success('Candidate profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Candidate Information</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Candidate Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, academic history, target tech skills, and portfolio links.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Profile Completion Gauge (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 text-center space-y-4">
            <div className="relative mx-auto w-24 h-24">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-500/20 shadow-md"
              />
              <span className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-darkCard">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{formData.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formData.title}</p>
            </div>

            {/* Profile Completion Section */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Profile Completeness
                </span>
                <span className="font-bold text-primary-600 dark:text-primary-400">85%</span>
              </div>
              <ProgressBar progress={85} showPercentage={false} color="gradient" height="h-2" />
              <p className="text-[11px] text-slate-400">
                Add an additional project or cloud certification to reach 100%.
              </p>
            </div>
          </Card>

          {/* Social Profiles */}
          <Card className="p-6 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              External Portfolios & Handles
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <GithubIcon className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{formData.github}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <LinkedinIcon className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">{formData.linkedin}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">{formData.portfolio}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Personal & Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </Card>

            {/* Academic Information */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Education & College Background
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    University / College
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree & Specialization
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </Card>

            {/* Skills Management */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Technical Skills & Tags
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((s, idx) => (
                  <SkillBadge
                    key={idx}
                    name={s}
                    category="framework"
                    onRemove={handleRemoveSkill}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill (e.g. Redis, GraphQL)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={handleAddSkill}
                >
                  Add Skill
                </Button>
              </div>
            </Card>

            {/* Social Handles */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Online Profiles & Links
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Portfolio / Website URL
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Save}
                isLoading={isSaving}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
