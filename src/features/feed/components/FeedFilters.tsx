"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { IPostFilters } from "@/services/post.service";
import { getDivisions, getDistricts, getUpazilas } from "@/lib/bd-location";

interface FeedFiltersProps {
  filters: IPostFilters;
  onChange: (newFilters: IPostFilters) => void;
}

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 transition-colors";

export function FeedFilters({ filters, onChange }: FeedFiltersProps) {
  const handleTypeChange = (type: string) => {
    if (filters.type === type) {
      onChange({ ...filters, type: undefined });
    } else {
      onChange({ ...filters, type });
    }
  };

  const divisions = useMemo(() => getDivisions(), []);
  const districts = useMemo(
    () => (filters.division ? getDistricts(filters.division) : []),
    [filters.division]
  );
  const upazilas = useMemo(
    () => (filters.division && filters.district ? getUpazilas(filters.division, filters.district) : []),
    [filters.division, filters.district]
  );

  return (
    <div className="space-y-6 sticky top-20 max-h-[85vh] overflow-y-auto pr-2 pb-10 custom-scrollbar">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search keywords..." 
          className="pl-9 bg-card"
          value={filters.searchTerm || ""}
          onChange={(e) => onChange({ ...filters, searchTerm: e.target.value })}
        />
      </div>

      {/* Sorting Configuration */}
      <div className="bg-card rounded-xl border border-primary/10 p-5 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Sort Posts</h3>
        <div className="space-y-3">
          <select 
            className={selectClass}
            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [val, order] = e.target.value.split('-');
              onChange({ ...filters, sortBy: val, sortOrder: order as any });
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="bloodBags-desc">Most Bags Needed</option>
            <option value="targetAmount-desc">Highest Target Amount</option>
          </select>
        </div>
      </div>

      {/* Type Configuration */}
      <div className="bg-card rounded-xl border border-primary/10 p-5 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Post Type</h3>
        <div className="flex flex-col gap-2">
          <Button 
            variant={filters.type === "BLOOD_FINDING" ? "default" : "outline"}
            className={`justify-start ${filters.type === "BLOOD_FINDING" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}`}
            onClick={() => handleTypeChange("BLOOD_FINDING")}
          >
            Blood Requests
          </Button>
          <Button 
            variant={filters.type === "BLOOD_DONATION" ? "default" : "outline"}
            className={`justify-start ${filters.type === "BLOOD_DONATION" ? "bg-emerald-500 text-primary-foreground hover:bg-emerald-600" : ""}`}
            onClick={() => handleTypeChange("BLOOD_DONATION")}
          >
            Donation Offers
          </Button>
          <Button 
            variant={filters.type === "HELPING" ? "default" : "outline"}
            className={`justify-start ${filters.type === "HELPING" ? "bg-blue-500 text-primary-foreground hover:bg-blue-600" : ""}`}
            onClick={() => handleTypeChange("HELPING")}
          >
            Medical Help
          </Button>
        </div>
      </div>

      {/* Deep Filters */}
      <div className="bg-card rounded-xl border border-primary/10 p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        
        {/* Blood Group */}
        {(filters.type === "BLOOD_FINDING" || filters.type === "BLOOD_DONATION" || !filters.type) && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Blood Group</label>
            <select 
              className={selectClass}
              value={filters.bloodGroup || ""}
              onChange={(e) => onChange({ ...filters, bloodGroup: e.target.value })}
            >
              <option value="">All Blood Groups</option>
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
            </select>
          </div>
        )}

        {/* Location Filtering */}
        <div className="space-y-3 pt-2">
           <div className="space-y-1">
             <label className="text-xs font-semibold text-muted-foreground uppercase">Division</label>
             <select 
               className={selectClass}
               value={filters.division || ""}
               onChange={(e) => onChange({ ...filters, division: e.target.value, district: "", upazila: "" })}
             >
               <option value="">All Divisions</option>
               {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
             </select>
           </div>
           
           <div className="space-y-1">
             <label className="text-xs font-semibold text-muted-foreground uppercase">District</label>
             <select 
               className={selectClass}
               value={filters.district || ""}
               onChange={(e) => onChange({ ...filters, district: e.target.value, upazila: "" })}
               disabled={!filters.division}
             >
               <option value="">All Districts</option>
               {districts.map((d) => <option key={d} value={d}>{d}</option>)}
             </select>
           </div>
           
           <div className="space-y-1">
             <label className="text-xs font-semibold text-muted-foreground uppercase">Upazila</label>
             <select 
               className={selectClass}
               value={filters.upazila || ""}
               onChange={(e) => onChange({ ...filters, upazila: e.target.value })}
               disabled={!filters.district}
             >
               <option value="">All Upazilas</option>
               {upazilas.map((u) => <option key={u} value={u}>{u}</option>)}
             </select>
           </div>
        </div>

        {/* Clear Filters */}
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-xs font-semibold"
          onClick={() => onChange({ searchTerm: "", type: "", bloodGroup: "", division: "", district: "", upazila: "", sortBy: "createdAt", sortOrder: "desc" })}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
