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
  const [leaderboard, setLeaderboard] = useState<[string, number][]>([]);

  const provider = new ethers.JsonRpcProvider(
    "https://jenkins.rpc.caldera.xyz/http",
    1798,
  );

  useEffect(() => {
    (async () => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let result = await contract.getLeaderboard();

      result = result.reduce((acc: any, [key, value]: [number, any]) => {
        acc[key] = Number(value);

        return acc;
      }, {});

      console.log(result);

      setLeaderboard(
        (Object.entries(result) as [string, number][]).sort(
          ([, a], [, b]) => b - a,
        ) as [string, number][],
      );
    })();
  }, []);

  console.log(leaderboard);

  return (
    <>
      <Table aria-label="Leaderboard" className="p-8">
        <TableHeader>
          <TableColumn>{""}</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Wristband Address</TableColumn>
        </TableHeader>
        <TableBody>
          {leaderboard.map(([address, points]: [string, number]) => (
            <TableRow key={address}>
              <TableCell>
                <Avatar
                  name={address}
                  src={`https://effigy.im/a/${address}.png`}
                />
              </TableCell>
              <TableCell>{points.toString()}</TableCell>
              <TableCell>{address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
