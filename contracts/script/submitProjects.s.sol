pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {VoteTracker} from "../src/VoteTracker.sol";

contract SubmitProjectsScript is Script {
    string[] public projects;

    function run(address addr) external {
        VoteTracker tracker = VoteTracker(addr);
        string[66] memory const_projects = [
            "ne637",
            "ypqi5",
            "rb4vd",
            "5nir5",
            "9r638",
            "wvtjg",
            "5kt5e",
            "1juqr",
            "pmgqb",
            "7i953",
            "evb84",
            "xarwm",
            "bwgz6",
            "e7pbe",
            "kj5h3",
            "ym4jn",
            "uc25t",
            "w157h",
            "1scyx",
            "498r0",
            "1nq6z",
            "2zo8n",
            "ix6d1",
            "tz6d0",
            "4vuyp",
            "6rnv1",
            "y9xr3",
            "zubi9",
            "5p8nw",
            "ddt22",
            "9yc3i",
            "gygv3",
            "mbfmy",
            "b6bws",
            "hbet5",
            "ocv5k",
            "x0nf0",
            "f6pgy",
            "drggu",
            "j0mx9",
            "ffnsd",
            "ojo7t",
            "h2bre",
            "3p080",
            "6y5hh",
            "0b2mv",
            "8hyxg",
            "qb57w",
            "7pscw",
            "eqxpi",
            "etztn",
            "s3uio",
            "59jqu",
            "pg8eb",
            "owxsp",
            "qjvz4",
            "cu60x",
            "7j3ur",
            "vi6xx",
            "iwf98",
            "h5a0y",
            "4j05w",
            "6ivcp",
            "3sfab",
            "413m8",
            "7tnkp"
        ];
        projects = const_projects;
        vm.broadcast();
        tracker.submitShowcaseData(projects);
    }
}
