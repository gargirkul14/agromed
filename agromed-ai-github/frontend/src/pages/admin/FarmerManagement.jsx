import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import {
  Users,
  Search,
  Eye,
  Briefcase,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

export default function FarmerManagement() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    async function fetchFarmers() {
      setLoading(true);
      try {
        const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
        const res = await api.get(`/admin/farmers${query}`);
        if (res.data.success) {
          setFarmers(res.data.farmers || []);
        }
      } catch (err) {
        console.error('Failed to load farmers:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchFarmers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-health-700 bg-health-100 px-3 py-1 rounded-full">
            Directory Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Farmer Registry & Profiles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, view demographics, and inspect agricultural work conditions across registered farmers.
          </p>
        </div>

        <div className="shrink-0">
          <span className="px-4 py-2 rounded-2xl bg-health-50 border border-health-200 text-health-800 text-xs font-bold">
            {farmers.length} Registered Farmers
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, village, district, or state..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-health-500 text-xs sm:text-sm bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-health-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500">Querying farmer records...</p>
          </div>
        ) : farmers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Farmer Name</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">Work Profile</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {farmers.map((farmer) => {
                  const profile = farmer.farmerProfile;
                  const work = profile?.workProfile;
                  return (
                    <tr key={farmer.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{farmer.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Joined {new Date(farmer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="flex items-center space-x-1.5 text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{farmer.email}</span>
                        </div>
                        {farmer.phone && (
                          <div className="flex items-center space-x-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{farmer.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {profile?.village ? (
                          <div className="text-slate-700">
                            <span className="font-semibold">{profile.village}</span>, {profile.district || profile.state}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {profile?.yearsOfFarming !== null && profile?.yearsOfFarming !== undefined ? (
                          <span className="font-semibold text-slate-700">{profile.yearsOfFarming} Years</span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {work?.cropName ? (
                          <span className="inline-flex items-center space-x-1 text-agri-800 bg-agri-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-agri-200">
                            <CheckCircle2 className="w-3 h-3 text-agri-600" />
                            <span>{work.cropName}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending Setup</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedFarmer(farmer)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-health-50 hover:bg-health-100 text-health-700 font-bold text-xs transition border border-health-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No farmer records found matching your query.
          </div>
        )}
      </div>

      {/* Profile Inspection Modal */}
      {selectedFarmer && (
        <Modal
          isOpen={Boolean(selectedFarmer)}
          onClose={() => setSelectedFarmer(null)}
          title={`Farmer Profile: ${selectedFarmer.name}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            
            {/* Demographics */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Demographic Details</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">EMAIL</span>
                  <span className="font-semibold text-slate-800">{selectedFarmer.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">PHONE</span>
                  <span className="font-semibold text-slate-800">{selectedFarmer.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">AGE / GENDER</span>
                  <span className="font-semibold text-slate-800">
                    {selectedFarmer.farmerProfile?.age ? `${selectedFarmer.farmerProfile.age} yrs` : 'N/A'}, {selectedFarmer.farmerProfile?.gender || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">VILLAGE</span>
                  <span className="font-semibold text-slate-800">{selectedFarmer.farmerProfile?.village || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">DISTRICT & STATE</span>
                  <span className="font-semibold text-slate-800">
                    {selectedFarmer.farmerProfile?.district || 'N/A'}, {selectedFarmer.farmerProfile?.state || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">FARMING EXPERIENCE</span>
                  <span className="font-semibold text-slate-800">
                    {selectedFarmer.farmerProfile?.yearsOfFarming ? `${selectedFarmer.farmerProfile.yearsOfFarming} Years` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Work Profile */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Work Profile & Exposure Hazards</h4>
              {selectedFarmer.farmerProfile?.workProfile ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">PRIMARY CROP</span>
                    <span className="font-semibold text-slate-800">{selectedFarmer.farmerProfile.workProfile.cropName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">FARMING TYPE</span>
                    <span className="font-semibold text-slate-800">{selectedFarmer.farmerProfile.workProfile.farmingType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">FARM SIZE</span>
                    <span className="font-semibold text-slate-800">{selectedFarmer.farmerProfile.workProfile.farmSize || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">DAILY WORK HOURS</span>
                    <span className="font-semibold text-slate-800">{selectedFarmer.farmerProfile.workProfile.averageWorkingHours} hours/day</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">DAYS WORKED</span>
                    <span className="font-semibold text-slate-800">{selectedFarmer.farmerProfile.workProfile.daysWorkedPerWeek} days/week</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">USES PESTICIDES</span>
                    <span className="font-semibold text-slate-800">
                      {selectedFarmer.farmerProfile.workProfile.usesPesticides ? 'Yes (Hazardous)' : 'No'}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-slate-400 block text-[11px]">REGISTERED PPE GEAR</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedFarmer.farmerProfile.workProfile.ppeUsed?.map((gear, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          {gear}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 italic text-xs">Work profile has not been completed by this farmer yet.</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedFarmer(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Close Window
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}
