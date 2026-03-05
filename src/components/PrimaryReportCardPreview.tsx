import { Card } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";

interface Subject {
  name: string;
  teacher: string;
  marks: number;
  grade: string;
  comment: string;
}

interface PrimaryReportCardPreviewProps {
  schoolName: string;
  schoolMotto: string;
  schoolPOBox: string;
  schoolLocation: string;
  schoolLogo: string;
  logoSize: number;
  studentName: string;
  studentClass: string;
  stream: string;
  outOf: number | "";
  position: number | "";
  term: string;
  year: string;
  division: string;
  subjects: Subject[];
  classTeacherComment: string;
  headTeacherComment: string;
  classTeacherSignature: string;
  headTeacherSignature: string;
  classTeacherSignDate: string;
  headTeacherSignDate: string;
  nextTermBegins: string;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  headerColor: string;
  borderStyle: string;
  backgroundImage: string;
  pdfWidth: number;
  pdfHeight: number;
}

const PrimaryReportCardPreview = ({
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
  classTeacherSignature,
  headTeacherSignature,
  classTeacherSignDate,
  headTeacherSignDate,
  nextTermBegins,
  fontFamily,
  backgroundColor,
  textColor,
  headerColor,
  borderStyle,
  backgroundImage,
  pdfWidth,
  pdfHeight,
}: PrimaryReportCardPreviewProps) => {
  const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const average = subjects.length > 0 ? (totalMarks / subjects.length).toFixed(1) : "0.0";
  
  const gradeToPoints: { [key: string]: number } = {
    "D1": 1, "D2": 2, "C3": 3, "C4": 4, "C5": 5, "C6": 6,
    "P7": 7, "P8": 8, "F9": 9
  };
  
  const aggregates = subjects.reduce((sum, subject) => {
    return sum + (gradeToPoints[subject.grade] || 0);
  }, 0);

  const reportData = {
    schoolName,
    studentName,
    studentClass,
    stream,
    term,
    year,
    subjects,
    totalMarks,
    average,
    aggregates,
    division,
  };

  const borderStyles: { [key: string]: string } = {
    solid: "border-4 border-solid",
    double: "border-8 border-double",
    dashed: "border-4 border-dashed",
    dotted: "border-4 border-dotted",
    ridge: "border-4 border-ridge",
    groove: "border-4 border-groove",
    none: "",
  };

  return (
    <div style={{ width: '210mm', height: '297mm', margin: '0 auto' }}>
      <Card 
        className={`p-6 h-full ${borderStyles[borderStyle] || ""}`}
        style={{ 
          fontFamily,
          backgroundColor,
          color: textColor,
          borderColor: headerColor,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Section with Logo and School Info */}
        <div className="mb-4">
          {/* Logo centered at top */}
          {schoolLogo && (
            <div className="flex justify-center mb-2">
              <img 
                src={schoolLogo} 
                alt="School Logo" 
                className="object-contain"
                style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
              />
            </div>
          )}
          {/* School info centered */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1" style={{ color: headerColor }}>
              {schoolName}
            </h1>
            <p className="text-sm italic mb-1">{schoolMotto}</p>
            <p className="text-xs mb-1">{schoolPOBox}</p>
            <p className="text-xs">{schoolLocation}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-4" style={{ color: headerColor }}>
          STUDENT REPORT CARD
        </h2>

        {/* Student Info Section */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="mb-1"><strong>Student Name:</strong> {studentName}</p>
            <p className="mb-1"><strong>Class:</strong> {studentClass}</p>
            <p className="mb-1"><strong>Stream:</strong> {stream}</p>
            {position !== "" && outOf !== "" && (
              <p className="mb-1"><strong>Position:</strong> {position} out of {outOf}</p>
            )}
          </div>
          <div className="text-right">
            <p className="mb-1"><strong>Term:</strong> {term}</p>
            <p className="mb-1"><strong>Year:</strong> {year}</p>
            <p className="mb-1"><strong>Aggregates:</strong> {aggregates}</p>
            <p className="mb-1"><strong>Division:</strong> {division}</p>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr style={{ backgroundColor: headerColor, color: backgroundColor }}>
                <th className="border p-1">Subject</th>
                <th className="border p-1">Marks</th>
                <th className="border p-1">Grade</th>
                <th className="border p-1">Comment</th>
                <th className="border p-1">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index}>
                  <td className="border p-1">{subject.name}</td>
                  <td className="border p-1 text-center">{subject.marks}</td>
                  <td className="border p-1 text-center">{subject.grade}</td>
                  <td className="border p-1">{subject.comment}</td>
                  <td className="border p-1">{subject.teacher}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border p-1">TOTAL</td>
                <td className="border p-1 text-center">{totalMarks}</td>
                <td className="border p-1" colSpan={3}></td>
              </tr>
              <tr className="font-bold">
                <td className="border p-1">AVERAGE</td>
                <td className="border p-1 text-center">{average}</td>
                <td className="border p-1" colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comments Section */}
        <div className="mb-4">
          <div className="mb-3">
            <p className="font-bold mb-1 text-xs">Class Teacher's Comment:</p>
            <p className="p-2 border rounded text-xs">{classTeacherComment}</p>
            <div className="mt-2 flex justify-between items-center">
              {classTeacherSignature && (
                <div className="inline-block">
                  <p className="text-lg font-bold italic" style={{ fontFamily: 'cursive', transform: 'rotate(-5deg)' }}>
                    {classTeacherSignature}
                  </p>
                </div>
              )}
              <p className="text-xs">Date: {classTeacherSignDate}</p>
            </div>
          </div>
          <div>
            <p className="font-bold mb-1 text-xs">Head Teacher's Comment:</p>
            <p className="p-2 border rounded text-xs">{headTeacherComment}</p>
            <div className="mt-2 flex justify-between items-center">
              {headTeacherSignature && (
                <div className="inline-block">
                  <p className="text-lg font-bold italic" style={{ fontFamily: 'cursive', transform: 'rotate(-3deg)', textDecoration: 'underline' }}>
                    {headTeacherSignature}
                  </p>
                </div>
              )}
              <p className="text-xs">Date: {headTeacherSignDate}</p>
            </div>
          </div>
        </div>

        {/* Next Term Begins Section */}
        <div className="mb-4 text-xs">
          <p className="mb-1"><strong>Next Term Begins:</strong> {nextTermBegins}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mt-2">
          <div className="text-center">
            <QRCodeSVG 
              value={JSON.stringify(reportData)}
              size={80}
              level="H"
            />
            <p className="text-xs mt-1">Scan to verify report card</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrimaryReportCardPreview;