import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrimaryReportCardPreview from "@/components/PrimaryReportCardPreview";
import SecondaryReportCardPreview from "@/components/SecondaryReportCardPreview";
import { SavedReportsManager } from "@/components/SavedReportsManager";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Upload, Download, Plus, Trash2, LogOut, Palette } from "lucide-react";

interface Subject {
  name: string;
  teacher: string;
  marks: number;
  grade: string;
  comment: string;
}

const Generator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<"primary" | "secondary">("primary");

  const [schoolName, setSchoolName] = useState("");
  const [schoolMotto, setSchoolMotto] = useState("");
  const [schoolPOBox, setSchoolPOBox] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("");
  const [schoolLogo, setSchoolLogo] = useState("");
  const [logoSize, setLogoSize] = useState(80);

  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [stream, setStream] = useState("");
  const [outOf, setOutOf] = useState<number | "">("");
  const [position, setPosition] = useState<number | "">("");
  const [term, setTerm] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [division, setDivision] = useState("I");

  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "", teacher: "", marks: 0, grade: "D1", comment: "" }
  ]);

  const [classTeacherComment, setClassTeacherComment] = useState("");
  const [headTeacherComment, setHeadTeacherComment] = useState("");
  const [nextTermBegins, setNextTermBegins] = useState("");
  const [classTeacherSignature, setClassTeacherSignature] = useState("");
  const [headTeacherSignature, setHeadTeacherSignature] = useState("");
  const [classTeacherSignDate, setClassTeacherSignDate] = useState("");
  const [headTeacherSignDate, setHeadTeacherSignDate] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderWidth, setBorderWidth] = useState(2);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [pdfWidth, setPdfWidth] = useState(210);
  const [pdfHeight, setPdfHeight] = useState(297);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchoolLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: keyof Subject, value: string | number) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", teacher: "", marks: 0, grade: "D1", comment: "" }]);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        const importedSubjects: Subject[] = jsonData.map((row) => ({
          name: row.Subject || "",
          teacher: row.Teacher || "",
          marks: Number(row.Marks) || 0,
          grade: row.Grade || "D1",
          comment: row.Comment || "",
        }));
        
        setSubjects(importedSubjects);
        toast.success("Subjects imported successfully!");
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const downloadExcelTemplate = () => {
    const template = [
      { Subject: "Mathematics", Teacher: "Mr. Smith", Marks: 85, Grade: "A", Comment: "Excellent work" },
      { Subject: "English", Teacher: "Ms. Johnson", Marks: 78, Grade: "B", Comment: "Good progress" },
    ];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "subjects_template.xlsx");
  };

  const downloadReportCard = async () => {
    const reportElement = document.getElementById("report-card-preview");
    if (!reportElement) return;

    try {
      // A4 dimensions in mm
      const a4WidthMM = 210;
      const a4HeightMM = 297;
      
      // Add padding to ensure borders are captured
      const padding = 20;
      
      // Create canvas with padding to capture all borders
      const canvas = await html2canvas(reportElement, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: -padding,
        scrollY: -padding,
        windowWidth: reportElement.scrollWidth + (padding * 2),
        windowHeight: reportElement.scrollHeight + (padding * 2),
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add image to fill entire A4 page
      pdf.addImage(imgData, "PNG", 0, 0, a4WidthMM, a4HeightMM, undefined, "FAST");

      pdf.save(`${studentName || "report"}_${term}_${year}.pdf`);
      toast.success("Report card downloaded!");
    } catch (error) {
      toast.error("Failed to download report card");
      console.error(error);
    }
  };

  const printReportCard = () => {
    const reportElement = document.getElementById("report-card-preview");
    if (!reportElement) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Add print styles for A4
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report Card - ${studentName || "Student"}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
            }
            #print-content {
              width: 210mm;
              height: 297mm;
              page-break-after: avoid;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              #print-content {
                width: 210mm;
                height: 297mm;
              }
            }
          </style>
        </head>
        <body>
          <div id="print-content">
            ${reportElement.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const generateComplexSignature = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 60);
    for (let i = 0; i < 5; i++) {
      ctx.quadraticCurveTo(
        30 + i * 30 + Math.random() * 20,
        30 + Math.random() * 30,
        50 + i * 30,
        60 + Math.random() * 10
      );
    }
    ctx.stroke();
    
    return canvas.toDataURL();
  };

  const getCurrentReportData = () => {
    return {
      reportType,
      schoolName,
      schoolMotto,
      schoolPOBox,
      schoolLocation,
      schoolLogo,
      logoSize,
      studentName,
      studentClass,
      stream,
      outOf,
      position,
      term,
      year,
      division,
      subjects,
      classTeacherComment,
      headTeacherComment,
      nextTermBegins,
      classTeacherSignature,
      headTeacherSignature,
      classTeacherSignDate,
      headTeacherSignDate,
      backgroundImage,
      borderStyle,
      borderColor,
      borderWidth,
      fontFamily,
      primaryColor,
      pdfWidth,
      pdfHeight,
    };
  };

  const loadReportData = (data: any) => {
    setReportType(data.reportType || "primary");
    setSchoolName(data.schoolName || "");
    setSchoolMotto(data.schoolMotto || "");
    setSchoolPOBox(data.schoolPOBox || "");
    setSchoolLocation(data.schoolLocation || "");
    setSchoolLogo(data.schoolLogo || "");
    setLogoSize(data.logoSize || 80);
    setStudentName(data.studentName || "");
    setStudentClass(data.studentClass || "");
    setStream(data.stream || "");
    setOutOf(data.outOf || "");
    setPosition(data.position || "");
    setTerm(data.term || "");
    setYear(data.year || new Date().getFullYear().toString());
    setDivision(data.division || "I");
    setSubjects(data.subjects || []);
    setClassTeacherComment(data.classTeacherComment || "");
    setHeadTeacherComment(data.headTeacherComment || "");
    setNextTermBegins(data.nextTermBegins || "");
    setClassTeacherSignature(data.classTeacherSignature || "");
    setHeadTeacherSignature(data.headTeacherSignature || "");
    setClassTeacherSignDate(data.classTeacherSignDate || "");
    setHeadTeacherSignDate(data.headTeacherSignDate || "");
    setBackgroundImage(data.backgroundImage || "");
    setBorderStyle(data.borderStyle || "solid");
    setBorderColor(data.borderColor || "#000000");
    setBorderWidth(data.borderWidth || 2);
    setFontFamily(data.fontFamily || "Arial");
    setPrimaryColor(data.primaryColor || "#4F46E5");
    setPdfWidth(data.pdfWidth || 210);
    setPdfHeight(data.pdfHeight || 297);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Report Card Generator</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={reportType} onValueChange={(v) => setReportType(v as "primary" | "secondary")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="primary">Primary Report Card</TabsTrigger>
                <TabsTrigger value="secondary">Secondary Report Card</TabsTrigger>
              </TabsList>
              
              <TabsContent value="primary" className="space-y-6">
                <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">School Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>School Name</Label>
                      <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                    </div>
                    <div>
                      <Label>School Motto</Label>
                      <Input value={schoolMotto} onChange={(e) => setSchoolMotto(e.target.value)} />
                    </div>
                    <div>
                      <Label>P.O. Box</Label>
                      <Input value={schoolPOBox} onChange={(e) => setSchoolPOBox(e.target.value)} />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={schoolLocation} onChange={(e) => setSchoolLocation(e.target.value)} />
                    </div>
                    <div>
                      <Label>School Logo</Label>
                      <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                    <div>
                      <Label>Logo Size (px)</Label>
                      <Input type="number" value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Student Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Student Name</Label>
                      <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Input value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
                    </div>
                    <div>
                      <Label>Stream</Label>
                      <Input value={stream} onChange={(e) => setStream(e.target.value)} />
                    </div>
                    <div>
                      <Label>Out Of</Label>
                      <Input 
                        type="number" 
                        min={1}
                        placeholder="Total students"
                        value={outOf} 
                        onChange={(e) => {
                          const val = e.target.value === "" ? "" : Number(e.target.value);
                          setOutOf(val);
                          if (val !== "" && position !== "" && position > val) {
                            setPosition(val);
                          }
                        }} 
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Select 
                        value={position === "" ? "" : String(position)} 
                        onValueChange={(v) => setPosition(v === "" ? "" : Number(v))}
                        disabled={outOf === "" || outOf < 1}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {outOf !== "" && outOf >= 1 && Array.from({ length: outOf }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Term</Label>
                      <Input value={term} onChange={(e) => setTerm(e.target.value)} />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input value={year} onChange={(e) => setYear(e.target.value)} />
                    </div>
                    <div>
                      <Label>Division</Label>
                      <Select value={division} onValueChange={setDivision}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="I">Division I</SelectItem>
                          <SelectItem value="II">Division II</SelectItem>
                          <SelectItem value="III">Division III</SelectItem>
                          <SelectItem value="IV">Division IV</SelectItem>
                          <SelectItem value="U">U (Ungraded)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Subjects</h2>
                    <div className="flex gap-2">
                      <Button onClick={downloadExcelTemplate} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Template
                      </Button>
                      <label>
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                          </span>
                        </Button>
                        <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
                      </label>
                      <Button onClick={addSubject} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  {subjects.map((subject, index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Subject {index + 1}</h3>
                        <Button onClick={() => removeSubject(index)} variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          placeholder="Subject Name"
                          value={subject.name}
                          onChange={(e) => updateSubject(index, "name", e.target.value)}
                        />
                        <Input
                          placeholder="Teacher"
                          value={subject.teacher}
                          onChange={(e) => updateSubject(index, "teacher", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Marks"
                          value={subject.marks}
                          onChange={(e) => updateSubject(index, "marks", Number(e.target.value))}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Select value={subject.grade} onValueChange={(v) => updateSubject(index, "grade", v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="D1">D1</SelectItem>
                            <SelectItem value="D2">D2</SelectItem>
                            <SelectItem value="C3">C3</SelectItem>
                            <SelectItem value="C4">C4</SelectItem>
                            <SelectItem value="C5">C5</SelectItem>
                            <SelectItem value="C6">C6</SelectItem>
                            <SelectItem value="P7">P7</SelectItem>
                            <SelectItem value="P8">P8</SelectItem>
                            <SelectItem value="F9">F9</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Comment"
                          value={subject.comment}
                          onChange={(e) => updateSubject(index, "comment", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </Card>

                <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Comments & Signatures</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Class Teacher Comment</Label>
                      <Textarea value={classTeacherComment} onChange={(e) => setClassTeacherComment(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Class Teacher Signature</Label>
                        <div className="flex gap-2">
                          <Input value={classTeacherSignature} onChange={(e) => setClassTeacherSignature(e.target.value)} placeholder="Or upload image" />
                          <Button onClick={() => setClassTeacherSignature(generateComplexSignature())} size="sm">
                            Generate
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Class Teacher Sign Date</Label>
                        <Input type="date" value={classTeacherSignDate} onChange={(e) => setClassTeacherSignDate(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label>Head Teacher Comment</Label>
                      <Textarea value={headTeacherComment} onChange={(e) => setHeadTeacherComment(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Head Teacher Signature</Label>
                        <div className="flex gap-2">
                          <Input value={headTeacherSignature} onChange={(e) => setHeadTeacherSignature(e.target.value)} placeholder="Or upload image" />
                          <Button onClick={() => setHeadTeacherSignature(generateComplexSignature())} size="sm">
                            Generate
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Head Teacher Sign Date</Label>
                        <Input type="date" value={headTeacherSignDate} onChange={(e) => setHeadTeacherSignDate(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label>Next Term Begins</Label>
                      <Input type="date" value={nextTermBegins} onChange={(e) => setNextTermBegins(e.target.value)} />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Customization
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Background Image</Label>
                      <Input type="file" accept="image/*" onChange={handleBackgroundImageUpload} />
                    </div>
                    <div>
                      <Label>Border Style</Label>
                      <Select value={borderStyle} onValueChange={setBorderStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                          <SelectItem value="double">Double</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Border Color</Label>
                      <Input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
                    </div>
                    <div>
                      <Label>Border Width (px)</Label>
                      <Input type="number" value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} />
                    </div>
                    <div>
                      <Label>Font Family</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Primary Color</Label>
                      <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                    </div>
                    <div>
                      <Label>PDF Width (mm)</Label>
                      <Input type="number" value={pdfWidth} onChange={(e) => setPdfWidth(Number(e.target.value))} />
                    </div>
                    <div>
                      <Label>PDF Height (mm)</Label>
                      <Input type="number" value={pdfHeight} onChange={(e) => setPdfHeight(Number(e.target.value))} />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex gap-4">
                    <Button onClick={downloadReportCard} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button onClick={printReportCard} variant="outline" className="flex-1">
                      Print
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="secondary">
                <Card className="p-6">
                  <p className="text-muted-foreground">
                    Secondary report card customization options will be available here.
                    You can modify the format and layout according to your needs.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <SavedReportsManager 
              onLoadReport={loadReportData}
              currentReportData={getCurrentReportData()}
              reportName={`${studentName}_${term}_${year}`}
            />
            
            <div id="report-card-preview" className="bg-white">
              {reportType === "primary" ? (
                <PrimaryReportCardPreview
                  schoolName={schoolName}
                  schoolMotto={schoolMotto}
                  schoolPOBox={schoolPOBox}
                  schoolLocation={schoolLocation}
                  schoolLogo={schoolLogo}
                  logoSize={logoSize}
                  studentName={studentName}
                  studentClass={studentClass}
                  stream={stream}
                  outOf={outOf}
                  position={position}
                  term={term}
                  year={year}
                  division={division}
                  subjects={subjects}
                  classTeacherComment={classTeacherComment}
                  headTeacherComment={headTeacherComment}
                  nextTermBegins={nextTermBegins}
                  classTeacherSignature={classTeacherSignature}
                  headTeacherSignature={headTeacherSignature}
                  classTeacherSignDate={classTeacherSignDate}
                  headTeacherSignDate={headTeacherSignDate}
                  fontFamily={fontFamily}
                  backgroundColor="#ffffff"
                  textColor="#000000"
                  headerColor={primaryColor}
                  borderStyle={borderStyle}
                  backgroundImage={backgroundImage}
                  pdfWidth={pdfWidth}
                  pdfHeight={pdfHeight}
                />
              ) : (
                <SecondaryReportCardPreview
                  schoolName={schoolName}
                  schoolMotto={schoolMotto}
                  schoolPOBox={schoolPOBox}
                  schoolLocation={schoolLocation}
                  schoolLogo={schoolLogo}
                  logoSize={logoSize}
                  studentName={studentName}
                  studentClass={studentClass}
                  stream={stream}
                  term={term}
                  year={year}
                  division={division}
                  subjects={subjects}
                  classTeacherComment={classTeacherComment}
                  headTeacherComment={headTeacherComment}
                  termBegins={nextTermBegins}
                  termEnds=""
                  classTeacherSignature={classTeacherSignature}
                  headTeacherSignature={headTeacherSignature}
                  classTeacherSignDate={classTeacherSignDate}
                  headTeacherSignDate={headTeacherSignDate}
                  fontFamily={fontFamily}
                  backgroundColor="#ffffff"
                  textColor="#000000"
                  headerColor={primaryColor}
                  borderStyle={borderStyle}
                  backgroundImage={backgroundImage}
                  pdfWidth={pdfWidth}
                  pdfHeight={pdfHeight}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
