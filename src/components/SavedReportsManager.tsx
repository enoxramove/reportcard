import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Folder, File, Trash2, Plus, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SavedReportsManagerProps {
  onLoadReport?: (reportData: any) => void;
  currentReportData?: any;
  reportName?: string;
}

export const SavedReportsManager = ({ onLoadReport, currentReportData, reportName }: SavedReportsManagerProps) => {
  const [folders, setFolders] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [saveReportName, setSaveReportName] = useState("");
  const [saveToFolder, setSaveToFolder] = useState<string>("none");
  const { toast } = useToast();

  useEffect(() => {
    fetchFolders();
    fetchReports();
  }, []);

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading folders", variant: "destructive" });
    } else {
      setFolders(data || []);
    }
  };

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("saved_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading reports", variant: "destructive" });
    } else {
      setReports(data || []);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: "Please enter a folder name", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("folders")
      .insert({ user_id: user.id, name: newFolderName.trim() });

    if (error) {
      toast({ title: "Error creating folder", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Folder created successfully" });
      setNewFolderName("");
      fetchFolders();
    }
  };

  const deleteFolder = async (folderId: string) => {
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", folderId);

    if (error) {
      toast({ title: "Error deleting folder", variant: "destructive" });
    } else {
      toast({ title: "Folder deleted" });
      fetchFolders();
      fetchReports();
    }
  };

  const saveReport = async () => {
    if (!saveReportName.trim() || !currentReportData) {
      toast({ title: "Please provide a report name", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("saved_reports")
      .insert({
        user_id: user.id,
        folder_id: saveToFolder === "none" ? null : saveToFolder,
        report_name: saveReportName.trim(),
        report_data: currentReportData
      });

    if (error) {
      toast({ title: "Error saving report", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Report saved successfully" });
      setSaveReportName("");
      setSaveToFolder("none");
      fetchReports();
    }
  };

  const deleteReport = async (reportId: string) => {
    const { error } = await supabase
      .from("saved_reports")
      .delete()
      .eq("id", reportId);

    if (error) {
      toast({ title: "Error deleting report", variant: "destructive" });
    } else {
      toast({ title: "Report deleted" });
      fetchReports();
    }
  };

  const loadReport = (reportData: any) => {
    if (onLoadReport) {
      onLoadReport(reportData);
      toast({ title: "Report loaded successfully" });
    }
  };

  const filteredReports = selectedFolder
    ? reports.filter(r => r.folder_id === selectedFolder)
    : reports.filter(r => !r.folder_id);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Saved Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Save Current Report */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Save Current Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Report name"
                value={saveReportName}
                onChange={(e) => setSaveReportName(e.target.value)}
              />
              <Select value={saveToFolder} onValueChange={setSaveToFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={saveReport} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Folder */}
        <div className="flex gap-2">
          <Input
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button onClick={createFolder}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Folders */}
        <div className="space-y-2">
          <h3 className="font-semibold">Folders</h3>
          <div className="space-y-1">
            <Button
              variant={selectedFolder === null ? "default" : "outline"}
              className="w-full justify-between"
              onClick={() => setSelectedFolder(null)}
            >
              <span className="flex items-center">
                <Folder className="w-4 h-4 mr-2" />
                All Reports
              </span>
            </Button>
            {folders.map((folder) => (
              <div key={folder.id} className="flex gap-2">
                <Button
                  variant={selectedFolder === folder.id ? "default" : "outline"}
                  className="flex-1 justify-start"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <Folder className="w-4 h-4 mr-2" />
                  {folder.name}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteFolder(folder.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Reports */}
        <div className="space-y-2">
          <h3 className="font-semibold">
            {selectedFolder
              ? folders.find(f => f.id === selectedFolder)?.name
              : "Unsorted Reports"}
          </h3>
          <div className="space-y-1">
            {filteredReports.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports found</p>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 justify-start"
                    onClick={() => loadReport(report.report_data)}
                  >
                    <File className="w-4 h-4 mr-2" />
                    {report.report_name}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteReport(report.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};