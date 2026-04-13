"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, ClipboardList, Database, Phone, User as UserIcon, Calendar, MoreHorizontal, Edit, Trash2, MapPin } from "lucide-react";
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
  const districts = useMemo(() => editDivision ? getDistricts(editDivision) : [], [editDivision]);
  const upazilas = useMemo(() => (editDivision && editDistrict) ? getUpazilas(editDivision, editDistrict) : [], [editDistrict, editDivision]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hospital-donation-records"],
    queryFn: getHospitalDonationRecords,
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

  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {Array.from({ length: 6 }).map((_, i) => <TableHead key={i}><Skeleton className="h-4 w-20" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-10 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-destructive/5 rounded-2xl border border-destructive/10 text-destructive">
        <Database className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-xl font-bold">Failed to load records</h3>
        <p className="text-sm">Please check your connection or try again later.</p>
      </div>
    );
  }

  const records = data?.data?.data || [];

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
        <ClipboardList className="w-16 h-16 mb-4 text-muted-foreground opacity-30" />
        <h3 className="text-xl font-semibold text-muted-foreground">No records found</h3>
        <p className="text-sm text-muted-foreground/70">You haven't recorded any blood donations yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="overflow-hidden border border-primary/10 rounded-xl shadow-sm bg-card/50 backdrop-blur-sm">
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
              <TableHead className="py-4 font-bold tracking-wider text-primary text-center">Blood Group</TableHead>
              <TableHead className="py-4 font-bold tracking-wider text-primary text-right">
                <div className="flex items-center justify-end gap-2"><Calendar className="w-4 h-4" /> Date</div>
              </TableHead>
              <TableHead className="py-4 font-bold tracking-wider text-primary text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record: any) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground px-2">
        <p>Showing {records.length} donation records</p>
        <p className="italic">* Data is synchronized with the central registry.</p>
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
                    {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upazila</Label>
              <Select disabled={!editDistrict} value={editUpazila} onValueChange={setEditUpazila}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {upazilas.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
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
