"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";

// Mock session data
const sessions = [
  {
    id: "1",
    header: "Cover page",
    sectionType: "Cover page",
    status: "In Review",
    target: "18",
    limit: "5",
    reviewer: "Eddie Lake"
  },
  {
    id: "2", 
    header: "Table of contents",
    sectionType: "Table of contents",
    status: "Done",
    target: "29",
    limit: "24",
    reviewer: "Eddie Lake"
  },
  {
    id: "3",
    header: "Executive summary", 
    sectionType: "Narrative",
    status: "Done",
    target: "10",
    limit: "13",
    reviewer: "Eddie Lake"
  },
  {
    id: "4",
    header: "Technical approach",
    sectionType: "Narrative", 
    status: "Done",
    target: "27",
    limit: "23",
    reviewer: "Jamie Tashpolotov"
  },
  {
    id: "5",
    header: "Design",
    sectionType: "Narrative",
    status: "In Progress", 
    target: "2",
    limit: "16",
    reviewer: "Jamie Tashpolotov"
  },
  {
    id: "6",
    header: "Capabilities",
    sectionType: "Narrative",
    status: "In Progress",
    target: "20", 
    limit: "8",
    reviewer: "Jamie Tashpolotov"
  },
  {
    id: "7",
    header: "Integration with existing systems",
    sectionType: "Narrative",
    status: "In Progress",
    target: "19",
    limit: "21", 
    reviewer: "Jamie Tashpolotov"
  },
  {
    id: "8",
    header: "Innovation and Advantages",
    sectionType: "Narrative",
    status: "Done",
    target: "25",
    limit: "26",
    reviewer: "Assign reviewer"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Done":
      return "text-emerald-600 bg-emerald-50";
    case "In Progress":
      return "text-orange-600 bg-orange-50";
    case "In Review":
      return "text-blue-600 bg-blue-50";
    default:
      return "text-slate-600 bg-slate-50";
  }
};

export default function SessionsTable() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Sessions</h3>
        </div>
        <div className="flex items-center gap-3">
          <Tabs defaultValue="outline" className="w-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="outline" className="text-xs">Outline</TabsTrigger>
              <TabsTrigger value="past" className="text-xs">Past Performance</TabsTrigger>
              <TabsTrigger value="key" className="text-xs">Key Personnel</TabsTrigger>
              <TabsTrigger value="focus" className="text-xs">Focus Documents</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs">
              <MoreHorizontal className="w-4 h-4 mr-1" />
              Customize Columns
            </Button>
            <Button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Add Section
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-xs font-medium text-slate-600">Header</TableHead>
              <TableHead className="text-xs font-medium text-slate-600">Section Type</TableHead>
              <TableHead className="text-xs font-medium text-slate-600">Status</TableHead>
              <TableHead className="text-xs font-medium text-slate-600">Target</TableHead>
              <TableHead className="text-xs font-medium text-slate-600">Limit</TableHead>
              <TableHead className="text-xs font-medium text-slate-600">Reviewer</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} className="hover:bg-slate-50">
                <TableCell className="text-sm text-slate-900">{session.header}</TableCell>
                <TableCell className="text-sm text-slate-500">{session.sectionType}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-slate-600">{session.target}</TableCell>
                <TableCell className="text-sm text-slate-600">{session.limit}</TableCell>
                <TableCell className="text-sm text-slate-600">{session.reviewer}</TableCell>
                <TableCell>
                  <Button className="w-8 h-8 p-0 hover:bg-slate-50">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}