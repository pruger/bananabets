"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

export default function Leaderboard() {
  return (
    <>
      <Table aria-label="Leaderboard" className="p-8">
        <TableHeader>
          <TableColumn>Rank</TableColumn>
          <TableColumn>Wristband Address</TableColumn>
        </TableHeader>
        <TableBody>
			{Array.from({ length: 100 }, (_, i) => (
				<TableRow key={i}>
					<TableCell>{i + 1}</TableCell>
					<TableCell>0x1111</TableCell>
				</TableRow>
			))}
        </TableBody>
      </Table>
    </>
  );
}
