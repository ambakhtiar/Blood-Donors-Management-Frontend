"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { IPostFilters } from "@/services/post.service";

interface FeedFiltersProps {
  filters: IPostFilters;
  onChange: (newFilters: IPostFilters) => void;
}

export function FeedFilters({ filters, onChange }: FeedFiltersProps) {
  const handleTypeChange = (type: string) => {
    if (filters.type === type) {
      onChange({ ...filters, type: undefined }); // toggle off
    } else {
      onChange({ ...filters, type });
    }
  };

  return (
    <div className="space-y-6 sticky top-20">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search locations or keywords..." 
          className="pl-9 bg-card"
          value={filters.searchTerm || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, searchTerm: e.target.value })}
        />
      </div>

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

      {/* Placeholder for future extended filters like Blood Group, District  */}
      {(filters.type === "BLOOD_FINDING" || filters.type === "BLOOD_DONATION") && (
        <div className="bg-card rounded-xl border border-primary/10 p-5 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Blood Group</h3>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filters.bloodGroup || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ ...filters, bloodGroup: e.target.value })}
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
    </div>
  );
}
