import { Card } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";

interface Subject {
  name: string;
  teacher: string;
  marks: number;
  grade: string;
  comment: string;
}

interface SecondaryReportCardPreviewProps {
  schoolName: string;
  schoolMotto: string;
  schoolPOBox: string;
  schoolLocation: string;
  schoolLogo: string;
  logoSize: number;
  studentName: string;
  studentClass: string;
  stream: string;
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
  termBegins: string;
  termEnds: string;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  headerColor: string;
  borderStyle: string;
  backgroundImage: string;
  pdfWidth: number;
  pdfHeight: number;
  customLayout?: string;
}

const SecondaryReportCardPreview = ({
  schoolName,
  schoolMotto,
  schoolPOBox,
  schoolLocation,
  schoolLogo,
  logoSize,
  studentName,
  studentClass,
  stream,
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
  termBegins,
  termEnds,
  fontFamily,
  backgroundColor,
  textColor,
  headerColor,
  borderStyle,
  backgroundImage,
  pdfWidth,
  pdfHeight,
}: SecondaryReportCardPreviewProps) => {
  const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const average = subjects.length > 0 ? (totalMarks / subjects.length).toFixed(1) : "0.0";
  
  const gradeToPoints: { [key: string]: number } = {
    "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 9
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
    <div style={{ width: `${pdfWidth}mm`, height: `${pdfHeight}mm`, margin: '0 auto' }}>
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
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          {schoolLogo && (
            <img 
              src={schoolLogo} 
              alt="School Logo" 
              className="object-contain"
              style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
            />
          )}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold mb-1" style={{ color: headerColor }}>
              {schoolName}
            </h1>
            <p className="text-sm italic mb-1">{schoolMotto}</p>
            <p className="text-xs">{schoolPOBox} | {schoolLocation}</p>
          </div>
          <div style={{ width: `${logoSize}px` }}></div>
        </div>

        <h2 className="text-xl font-bold text-center mb-4" style={{ color: headerColor }}>
          SECONDARY SCHOOL REPORT CARD
        </h2>

        {/* Student Info Section */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="mb-1"><strong>Name:</strong> {studentName}</p>
            <p className="mb-1"><strong>Class/Form:</strong> {studentClass}</p>
            <p className="mb-1"><strong>Stream:</strong> {stream}</p>
          </div>
          <div className="text-right">
            <p className="mb-1"><strong>Term:</strong> {term}</p>
            <p className="mb-1"><strong>Year:</strong> {year}</p>
            <p className="mb-1"><strong>Points:</strong> {aggregates}</p>
            <p className="mb-1"><strong>Division:</strong> {division}</p>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr style={{ backgroundColor: headerColor, color: backgroundColor }}>
                <th className="border p-1">Subject</th>
                <th className="border p-1">Marks (%)</th>
                <th className="border p-1">Grade</th>
                <th className="border p-1">Remarks</th>
                <th className="border p-1">Instructor</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index}>
                  <td className="border p-1">{subject.name}</td>
                  <td className="border p-1 text-center">{subject.marks}</td>
                  <td className="border p-1 text-center">
                    {subject.grade}
                    <sub className="ml-1">{gradeToPoints[subject.grade] || ""}</sub>
                  </td>
                  <td className="border p-1">{subject.comment}</td>
                  <td className="border p-1">{subject.teacher}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border p-1">TOTAL MARKS</td>
                <td className="border p-1 text-center">{totalMarks}</td>
                <td className="border p-1" colSpan={3}></td>
              </tr>
              <tr className="font-bold">
                <td className="border p-1">AVERAGE</td>
                <td className="border p-1 text-center">{average}%</td>
                <td className="border p-1" colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comments and Signatures */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-bold mb-1 text-xs">Form Teacher's Remarks:</p>
            <p className="p-2 border rounded text-xs min-h-[60px]">{classTeacherComment}</p>
            <div className="mt-2">
              {classTeacherSignature && (
                <div className="mb-1">
                  <p className="text-base font-bold italic" style={{ fontFamily: 'cursive', transform: 'rotate(-5deg)' }}>
                    {classTeacherSignature}
                  </p>
                </div>
              )}
              <p className="text-xs">Signature & Date: {classTeacherSignDate}</p>
            </div>
          </div>
          <div>
            <p className="font-bold mb-1 text-xs">Head Teacher's Remarks:</p>
            <p className="p-2 border rounded text-xs min-h-[60px]">{headTeacherComment}</p>
            <div className="mt-2">
              {headTeacherSignature && (
                <div className="mb-1">
                  <p className="text-base font-bold italic" style={{ fontFamily: 'cursive', transform: 'rotate(-3deg)', textDecoration: 'underline' }}>
                    {headTeacherSignature}
                  </p>
                </div>
              )}
              <p className="text-xs">Signature & Date: {headTeacherSignDate}</p>
            </div>
          </div>
        </div>

        {/* Term Dates */}
        <div className="flex justify-between mb-2 text-xs">
          <p><strong>Next Term Begins:</strong> {termBegins}</p>
          <p><strong>Term Ends:</strong> {termEnds}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mt-2">
          <div className="text-center">
            <QRCodeSVG 
              value={JSON.stringify(reportData)}
              size={70}
              level="H"
            />
            <p className="text-xs mt-1">Scan for verification</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecondaryReportCardPreview;