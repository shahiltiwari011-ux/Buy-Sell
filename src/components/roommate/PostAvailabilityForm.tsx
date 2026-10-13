import React, { useState, useEffect } from 'react';
import type { RoommateListing, RoomType, GenderPreference, Cleanliness, SleepSchedule } from '../../types';
import { 
  Sparkles, 
  User, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Check, 
  ShieldCheck, 
  Building, 
  Users 
} from 'lucide-react';

interface PostAvailabilityFormProps {
  initialData?: RoommateListing | null;
  onSave: (listingData: Omit<RoommateListing, 'id' | 'createdAt' | 'isUserCreated' | 'userId'>) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const COMMON_COLLEGES = [
  'Delhi University (North Campus)',
  'Delhi University (South Campus)',
  'IIT Delhi / Hauz Khas',
  'Jawaharlal Nehru University (JNU)',
  'National Institute of Design (NID)',
  'IP University / Dwarka',
  'Ashoka University / Sonepat Campus',
  'BITS Pilani',
  'Other / Local College'
];

const PRESET_LIFESTYLE_TAGS = [
  'Night Owl',
  'Early Bird',
  'Studious / Quiet',
  'Veg Friendly',
  'No Smoking',
  'Pet Friendly',
  'Gym Enthusiast',
  'Plant Parent',
  'Weekend Baker',
  'Creative Vibes',
  'Music Friendly',
  'Clean & Tidy'
];

const PRESET_AMENITIES = [
  'High-speed WiFi',
  'Split AC',
  'Attached Washroom',
  'Furnished Bed & Desk',
  'Washing Machine',
  'Private Balcony',
  'Kitchen Access',
  'RO Water Filter',
  '24x7 Security / Gated',
  'Cook Maid Setup',
  'Power Backup',
  'Parking Available'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
];

const PRESET_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
];

export const PostAvailabilityForm: React.FC<PostAvailabilityFormProps> = ({
  initialData,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [listingType, setListingType] = useState<'roommate' | 'room'>(initialData?.listingType || 'roommate');
  const [name, setName] = useState(initialData?.name || '');
  const [avatar, setAvatar] = useState(initialData?.avatar || PRESET_AVATARS[0]);
  const [college, setCollege] = useState(initialData?.college || COMMON_COLLEGES[0]);
  const [customCollege, setCustomCollege] = useState('');
  const [location, setLocation] = useState(initialData?.location || '');
  const [budget, setBudget] = useState(initialData?.budget ? String(initialData.budget) : '10000');
  const [moveInDate, setMoveInDate] = useState(initialData?.moveInDate || new Date().toISOString().slice(0, 10));
  const [roomType, setRoomType] = useState<RoomType>(initialData?.roomType || 'Private Room');
  const [genderPreference, setGenderPreference] = useState<GenderPreference>(initialData?.genderPreference || 'Any');
  const [lifestyleTags, setLifestyleTags] = useState<string[]>(
    initialData?.lifestyleTags || ['Night Owl', 'Studious / Quiet', 'Veg Friendly']
  );
  const [cleanliness, setCleanliness] = useState<Cleanliness>(initialData?.cleanliness || 'Very Neat');
  const [sleepSchedule, setSleepSchedule] = useState<SleepSchedule>(initialData?.sleepSchedule || 'Flexible');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [amenities, setAmenities] = useState<string[]>(
    initialData?.amenities || ['High-speed WiFi', 'AC', 'Kitchen Access']
  );
  const [roomImageUrl, setRoomImageUrl] = useState<string>(
    initialData?.roomImages?.[0] || PRESET_ROOM_IMAGES[0]
  );
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || 'student.usr26@campus.edu');
  const [customTagInput, setCustomTagInput] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialData) {
      setListingType(initialData.listingType);
      setName(initialData.name);
      setAvatar(initialData.avatar);
      if (COMMON_COLLEGES.includes(initialData.college)) {
        setCollege(initialData.college);
      } else {
        setCollege('Other / Local College');
        setCustomCollege(initialData.college);
      }
      setLocation(initialData.location);
      setBudget(String(initialData.budget));
      setMoveInDate(initialData.moveInDate);
      setRoomType(initialData.roomType);
      setGenderPreference(initialData.genderPreference);
      setLifestyleTags(initialData.lifestyleTags);
      setCleanliness(initialData.cleanliness);
      setSleepSchedule(initialData.sleepSchedule);
      setBio(initialData.bio);
      setAmenities(initialData.amenities);
      if (initialData.roomImages && initialData.roomImages.length > 0) {
        setRoomImageUrl(initialData.roomImages[0]);
      }
      setContactEmail(initialData.contactEmail);
    }
  }, [initialData]);

  const toggleLifestyleTag = (tag: string) => {
    setLifestyleTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !lifestyleTags.includes(customTagInput.trim())) {
      setLifestyleTags([...lifestyleTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleFillDemo = () => {
    if (listingType === 'roommate') {
      setName('Pooja Sundaram');
      setCollege('Delhi University (North Campus)');
      setLocation('Hudson Lane / Vijay Nagar');
      setBudget('11500');
      setMoveInDate('2026-11-01');
      setRoomType('Private Room');
      setGenderPreference('Female only');
      setLifestyleTags(['Night Owl', 'Studious / Quiet', 'Veg Friendly', 'Creative Vibes']);
      setCleanliness('Very Neat');
      setSleepSchedule('Night Owl');
      setBio('History Honors sophomore. Looking to team up for a bright 2BHK flat near Hudson Lane cafe strip. Responsible, friendly, love weekend sketching sessions, and super clean kitchen habits!');
      setContactEmail('pooja.hist26@campus.edu');
    } else {
      setName('Kunal Singhania');
      setCollege('IIT Delhi / Hauz Khas');
      setLocation('Kalu Sarai (3 min walk to Metro)');
      setBudget('13000');
      setMoveInDate('2026-11-05');
      setRoomType('Private Room');
      setGenderPreference('Male only');
      setLifestyleTags(['Fast WiFi', 'Near Metro', 'No Smoking', 'Clean & Tidy']);
      setCleanliness('Very Neat');
      setSleepSchedule('Flexible');
      setBio('Fully furnished private bedroom with attached washroom in a high-rise gated society. Flat is shared with 2 other engineering students. Maid and cook already in place.');
      setAmenities(['High-speed WiFi', 'Split AC', 'Attached Washroom', 'Furnished Bed & Desk', 'Washing Machine', 'Cook Maid Setup']);
      setRoomImageUrl(PRESET_ROOM_IMAGES[1]);
      setContactEmail('kunal.ee25@campus.edu');
    }
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    const finalCollege = college === 'Other / Local College' && customCollege.trim() ? customCollege.trim() : college;
    if (!finalCollege.trim()) {
      setFormError('Please provide your college name.');
      return;
    }
    if (!location.trim()) {
      setFormError('Please enter your preferred location / neighborhood.');
      return;
    }
    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget <= 0) {
      setFormError('Please enter a valid monthly budget / rent.');
      return;
    }
    if (!bio.trim() || bio.trim().length < 20) {
      setFormError('Please write a short introduction (at least 20 characters) so prospective roommates get to know you.');
      return;
    }

    setFormError('');

    onSave({
      listingType,
      name: name.trim(),
      avatar,
      college: finalCollege,
      location: location.trim(),
      budget: numBudget,
      moveInDate,
      roomType,
      genderPreference,
      lifestyleTags,
      cleanliness,
      sleepSchedule,
      bio: bio.trim(),
      amenities: listingType === 'room' ? amenities : [],
      roomImages: listingType === 'room' && roomImageUrl ? [roomImageUrl] : [],
      contactEmail: contactEmail.trim() || 'student@campus.edu'
    });
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 max-w-3xl mx-auto my-6 animate-in fade-in duration-200">
      
      {/* Top Banner / Demo Filler */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-black/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E2F952] border border-black rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {isEditing ? 'Editing Your Listing' : 'Student Housing Hub'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEditing ? 'Update Your Availability' : 'Post Your Availability'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Connect directly with verified students looking to team up or rent a room.
          </p>
        </div>

        <button
          id="btn-fill-demo-roommate"
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border-2 border-black/30 font-bold text-xs transition-colors cursor-pointer shrink-0"
          title="Autofill form with authentic sample student data"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Fill Demo Student Info</span>
        </button>
      </div>

      {formError && (
        <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-center justify-between">
          <span>⚠️ {formError}</span>
          <button onClick={() => setFormError('')} className="text-rose-500 hover:text-rose-800">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* 1. Listing Type Selector (Roommate vs Room) */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
            What are you posting? <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setListingType('roommate')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                listingType === 'roommate'
                  ? 'border-black bg-[#E2F952]/40 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'border-slate-200 hover:border-black bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">Find a Roommate</div>
                <div className="text-xs text-slate-600 font-medium">I need someone to look for a place or team up with</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setListingType('room')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                listingType === 'room'
                  ? 'border-black bg-[#E2F952]/40 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'border-slate-200 hover:border-black bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">Post an Available Room</div>
                <div className="text-xs text-slate-600 font-medium">I have a room/flat and need a tenant or housemate</div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Your Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Sen"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Verified Student Email (Relay) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your.name@campus.edu"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              🔒 Shielded from public view. Phone numbers are NEVER requested or displayed.
            </p>
          </div>
        </div>

        {/* Profile Avatar Selection */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Profile Avatar
          </label>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {PRESET_AVATARS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatar(url)}
                className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 shrink-0 transition-transform cursor-pointer ${
                  avatar === url
                    ? 'border-black ring-2 ring-[#E2F952] scale-105'
                    : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                {avatar === url && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 3. College & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              College / University <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {COMMON_COLLEGES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {college === 'Other / Local College' && (
              <input
                type="text"
                value={customCollege}
                onChange={(e) => setCustomCollege(e.target.value)}
                placeholder="Enter college name"
                className="mt-2 w-full px-3 py-2 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs font-bold text-slate-900 focus:outline-none"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Location / Area <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kamla Nagar, Hauz Khas, North Gate"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Budget, Move-in Date, Room Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Monthly Budget (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="font-bold text-slate-400 absolute left-3.5 top-2.5 text-sm">₹</span>
              <input
                type="number"
                min="1000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="10000"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Target Move-in Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as RoomType)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Private Room">Private Room</option>
              <option value="Shared Room">Shared Room</option>
              <option value="Entire Apartment">Entire Apartment</option>
            </select>
          </div>
        </div>

        {/* 5. Preferences: Gender, Cleanliness, Sleep Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Gender Preference
            </label>
            <select
              value={genderPreference}
              onChange={(e) => setGenderPreference(e.target.value as GenderPreference)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Any">Any Gender</option>
              <option value="Female only">Female only</option>
              <option value="Male only">Male only</option>
              <option value="Non-binary">Non-binary friendly</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Cleanliness Level
            </label>
            <select
              value={cleanliness}
              onChange={(e) => setCleanliness(e.target.value as Cleanliness)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Very Neat">Very Neat</option>
              <option value="Moderate">Moderate</option>
              <option value="Relaxed">Relaxed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Sleep Schedule
            </label>
            <select
              value={sleepSchedule}
              onChange={(e) => setSleepSchedule(e.target.value as SleepSchedule)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Night Owl">Night Owl</option>
              <option value="Early Bird">Early Bird</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>

        {/* 6. Lifestyle & Habits Tags */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
            Lifestyle & Habits
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_LIFESTYLE_TAGS.map((tag) => {
              const active = lifestyleTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleLifestyleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer ${
                    active
                      ? 'border-black bg-[#E2F952] text-black shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-400 text-slate-700'
                  }`}
                >
                  {tag} {active && '✓'}
                </button>
              );
            })}
          </div>

          {/* Add custom tag */}
          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              placeholder="Add custom tag (e.g. Musician)"
              className="flex-1 px-3 py-1.5 rounded-xl border-2 border-slate-200 focus:border-black bg-white text-xs font-medium text-slate-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="px-3 py-1.5 rounded-xl border-2 border-black bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        {/* 7. Room-specific fields if listingType === 'room' */}
        {listingType === 'room' && (
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-black/15 bg-slate-50 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_AMENITIES.map((item) => {
                  const active = amenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity(item)}
                      className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                        active
                          ? 'border-black bg-[#E2F952] text-black font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {active && <Check className="w-3.5 h-3.5 text-black shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room Photo Picker */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                Room Preview Photo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {PRESET_ROOM_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRoomImageUrl(img)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      roomImageUrl === img
                        ? 'border-black ring-2 ring-[#E2F952]'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Room preset" className="w-full h-full object-cover" />
                    {roomImageUrl === img && (
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. Short Introduction / Bio */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Short Introduction / About You <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell future roommates about yourself, your major, interests, daily routine, or what makes your apartment awesome..."
            className="w-full p-3 rounded-xl border-2 border-black/20 focus:border-black bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
            <span>Minimum 20 characters</span>
            <span>{bio.length} characters</span>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="pt-4 flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 border-2 border-black hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            id="btn-submit-post-availability"
            type="submit"
            className="flex-1 py-3 px-6 rounded-2xl font-black text-xs sm:text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isEditing ? 'Save Changes' : 'Publish Availability'}</span>
            <span className="text-base leading-none">↗</span>
          </button>
        </div>

      </form>
    </div>
  );
};
