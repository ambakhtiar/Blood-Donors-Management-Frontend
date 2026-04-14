"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, ClipboardList, Database, Phone, User as UserIcon, Calendar, MoreHorizontal, Edit, Trash2, MapPin, Search, FilterX, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { getHospitalDonationRecords, updateDonationRecord, deleteDonationRecord } from "@/services/hospital.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDivisions, getDistricts, getUpazilas } from "@/lib/bd-location";

// Custom useDebounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const BLOOD_GROUPS = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
];

export function HospitalRecordsTable() {
  const queryClient = useQueryClient();
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editDivision, setEditDivision] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [editUpazila, setEditUpazila] = useState("");

  const divisions = useMemo(() => getDivisions(), []);
  
  // Edit Location Dropdowns
  const editDistricts = useMemo(() => editDivision ? getDistricts(editDivision) : [], [editDivision]);
  const editUpazilas = useMemo(() => (editDivision && editDistrict) ? getUpazilas(editDivision, editDistrict) : [], [editDistrict, editDivision]);

  // ---------- Filters & Pagination State ----------
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [filterBloodGroup, setFilterBloodGroup] = useState<string>("ALL");
  const [filterDivision, setFilterDivision] = useState<string>("ALL");
  const [filterDistrict, setFilterDistrict] = useState<string>("ALL");
  const [filterUpazila, setFilterUpazila] = useState<string>("ALL");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [sortBy, setSortBy] = useState("donationDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter Location Dropdowns
  const filterDistricts = useMemo(() => filterDivision !== "ALL" ? getDistricts(filterDivision) : [], [filterDivision]);
  const filterUpazilas = useMemo(() => (filterDivision !== "ALL" && filterDistrict !== "ALL") ? getUpazilas(filterDivision, filterDistrict) : [], [filterDistrict, filterDivision]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filterBloodGroup, filterDivision, filterDistrict, filterUpazila, sortBy, sortOrder, limit]);

  const queryParams = {
    page,
    limit: Number(limit),
    sortBy,
    sortOrder,
    ...(debouncedSearchTerm && { searchTerm: debouncedSearchTerm }),
    ...(filterBloodGroup !== "ALL" && { bloodGroup: filterBloodGroup }),
    ...(filterDivision !== "ALL" && { division: filterDivision }),
    ...(filterDistrict !== "ALL" && { district: filterDistrict }),
    ...(filterUpazila !== "ALL" && { upazila: filterUpazila }),
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["hospital-donation-records", queryParams],
    queryFn: () => getHospitalDonationRecords(queryParams),
    placeholderData: (prev) => prev, // Keeps old data visible while fetching new page
  });

  const updateMutation = useMutation({
    mutationFn: updateDonationRecord,
    onSuccess: (res) => {
      toast.success(res.message || "Donor profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["hospital-donation-records"] });
      setEditingRecord(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update record");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDonationRecord,
    onSuccess: (res) => {
      toast.success(res.message || "Record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["hospital-donation-records"] });
      setDeletingRecordId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete record");
    }
  });

  const handleEditClick = (record: any) => {
    setEditingRecord(record);
    setEditName(record.bloodDonor.name || "");
    setEditContact(record.bloodDonor.contactNumber || "");
    setEditDivision(record.bloodDonor.division || "");
    setEditDistrict(record.bloodDonor.district || "");
    setEditUpazila(record.bloodDonor.upazila || "");
  };

  const handleSaveEdit = () => {
    if (!editName || !editContact) {
      toast.error("Name and Contact Number are required");
      return;
    }
    updateMutation.mutate({
      id: editingRecord.id,
      payload: {
        name: editName,
        contactNumber: editContact,
        division: editDivision,
        district: editDistrict,
        upazila: editUpazila,
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBloodGroup("ALL");
    setFilterDivision("ALL");
    setFilterDistrict("ALL");
    setFilterUpazila("ALL");
    setSortBy("donationDate");
    setSortOrder("desc");
    setPage(1);
    setLimit("10");
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const records = data?.data?.data || [];
  const meta = data?.data?.meta || { page: 1, limit: 10, total: 0 };
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-destructive/5 rounded-2xl border border-destructive/10 text-destructive">
        <Database className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-xl font-bold">Failed to load records</h3>
        <p className="text-sm">Please check your connection or try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500 space-y-4">
      {/* ---------- Filters Bar ---------- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by donor name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
          {/* Clear Filters */}
          <Button variant="outline" onClick={clearFilters} className="text-muted-foreground shrink-0 gap-2">
            <FilterX className="w-4 h-4" /> Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
            <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Blood Group" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Blood Groups</SelectItem>
              {BLOOD_GROUPS.map((bg) => <SelectItem key={bg.value} value={bg.value}>{bg.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterDivision} onValueChange={(val) => { setFilterDivision(val); setFilterDistrict("ALL"); setFilterUpazila("ALL"); }}>
            <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Division" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Divisions</SelectItem>
              {divisions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select disabled={filterDivision === "ALL"} value={filterDistrict} onValueChange={(val) => { setFilterDistrict(val); setFilterUpazila("ALL"); }}>
            <SelectTrigger className="bg-slate-50"><SelectValue placeholder="District" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Districts</SelectItem>
              {filterDistricts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select disabled={filterDistrict === "ALL"} value={filterUpazila} onValueChange={setFilterUpazila}>
            <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Upazila" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Upazilas</SelectItem>
              {filterUpazilas.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---------- Table Area ---------- */}
      <div className="overflow-hidden border border-primary/10 rounded-xl shadow-sm bg-card/50 backdrop-blur-sm relative">
        {/* Loading Overlay */}
        {isFetching && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        <Table>
          <TableHeader className="bg-primary/5 uppercase">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-4 font-bold tracking-wider text-primary">
                <div className="flex items-center gap-2"><UserIcon className="w-4 h-4" /> Donor</div>
              </TableHead>
              <TableHead className="py-4 font-bold tracking-wider text-primary">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> Contact</div>
              </TableHead>
              <TableHead className="py-4 font-bold tracking-wider text-primary">Location</TableHead>
              <TableHead className="py-4 text-center">
                <Button variant="ghost" className="uppercase font-bold tracking-wider text-primary px-0 hover:bg-transparent" onClick={() => toggleSort("bloodGroup")}>
                  Blood Group <ArrowUpDown className="w-3 h-3 ml-2" />
                </Button>
              </TableHead>
              <TableHead className="py-4 text-right">
                <div className="flex justify-end">
                  <Button variant="ghost" className="uppercase font-bold tracking-wider text-primary px-0 hover:bg-transparent" onClick={() => toggleSort("donationDate")}>
                    <Calendar className="w-4 h-4 mr-2" /> Date <ArrowUpDown className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </TableHead>
              <TableHead className="py-4 font-bold tracking-wider text-primary text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !records.length ? (
              // Initial Loading Skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-10 w-full" /></TableCell>)}
                </TableRow>
              ))
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <ClipboardList className="w-10 h-10 mb-2 opacity-20" />
                    <p>No donation records found matching your filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record: any) => (
                <TableRow key={record.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell className="font-medium whitespace-nowrap">
                    <div>{record.bloodDonor.name}</div>
                    <div className="text-xs text-muted-foreground italic">Weight: {record.weight}kg</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono">{record.bloodDonor.contactNumber}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {record.bloodDonor.division ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary/70" />
                        {record.bloodDonor.upazila ? `${record.bloodDonor.upazila}, ` : ''}{record.bloodDonor.district}
                      </div>
                    ) : <span className="opacity-50">Not Set</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold px-3">
                      {record.bloodDonor.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                    {format(new Date(record.donationDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 focus-visible:ring-0">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] shadow-lg border-primary/10">
                        <DropdownMenuItem onClick={() => handleEditClick(record)} className="cursor-pointer gap-2">
                          <Edit className="h-4 w-4 text-primary" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeletingRecordId(record.id)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive gap-2">
                          <Trash2 className="h-4 w-4" /> Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------- Pagination ---------- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Showing <span className="font-medium text-foreground">{records.length ? (page - 1) * meta.limit + 1 : 0}</span> to <span className="font-medium text-foreground">{Math.min(page * meta.limit, meta.total)}</span> of <span className="font-medium text-foreground">{meta.total}</span> records
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Rows per page</Label>
            <Select value={limit} onValueChange={(v) => { setLimit(v); setPage(1); }}>
              <SelectTrigger className="h-8 w-16 bg-slate-50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-medium px-4">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isFetching || totalPages === 0}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Donor Profile</DialogTitle>
            <DialogDescription>
              Update the global profile details for {editingRecord?.bloodDonor?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Donor Name" />
            </div>
            <div className="space-y-2">
              <Label>Contact Number *</Label>
              <Input value={editContact} onChange={(e) => setEditContact(e.target.value)} placeholder="+8801..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Division</Label>
                <Select value={editDivision} onValueChange={(val) => { setEditDivision(val); setEditDistrict(""); setEditUpazila(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {divisions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Select disabled={!editDivision} value={editDistrict} onValueChange={(val) => { setEditDistrict(val); setEditUpazila(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {editDistricts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upazila</Label>
              <Select disabled={!editDistrict} value={editUpazila} onValueChange={setEditUpazila}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {editUpazilas.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRecord(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingRecordId} onOpenChange={(open) => !open && setDeletingRecordId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this donation record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingRecordId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate(deletingRecordId!)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
