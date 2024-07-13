"use client";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import abi from "@/public/abi.json";
const CONTRACT_ADDRESS = "0x581aE9cD8e6AFfF77f1D45aF5274f3a2C1D8644d";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<[string, string, number][]>(
    [],
  );

  const provider = new ethers.JsonRpcProvider(
    "https://jenkins.rpc.caldera.xyz/http",
    1798,
  );

  useEffect(() => {
    (async () => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let result = await contract.getLeaderboard();

      setLeaderboard(
        result.sort((a: any, b: any) => {
          const lastItemA = a[a.length - 1];
          const lastItemB = b[b.length - 1];

          if (lastItemA > lastItemB) return -1;
          if (lastItemA < lastItemB) return 1;

          return 0;
        }) as [string, string, number][],
      );
    })();
  }, []);

  return (
    <>
      <Table aria-label="Leaderboard" className="p-8">
        <TableHeader>
          <TableColumn>{""}</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Username</TableColumn>
          <TableColumn>Wristband Address</TableColumn>
        </TableHeader>
        <TableBody>
          {leaderboard.map(([address, name, points]: [string, string, number]) => (
            <TableRow key={address}>
              <TableCell>
                <Avatar
                    name={address}
                    src={`https://effigy.im/a/${address}.png`}
                />
              </TableCell>
              <TableCell>{points.toString()}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
