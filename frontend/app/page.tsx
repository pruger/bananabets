"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@nextui-org/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
// @ts-ignore
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import { toast } from "react-toastify";
import { ethers } from "ethers";

import abi from "@/public/abi.json";
const CONTRACT_ADDRESS = "0x581aE9cD8e6AFfF77f1D45aF5274f3a2C1D8644d";
const API_HOST = "https://predictionmarketapi.cleartxn.xyz";

interface ProjectTileProps {
  title: string;
  description: string;
  image: string;
  onSelect: () => void;
  selected: boolean;
}

const ProjectTile: React.FC<ProjectTileProps> = ({
  title,
  description,
  image,
  onSelect,
  selected,
}) => (
  <Card className="py-4 sm:w-64" fullWidth>
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
      <Image
        alt="Card image"
        className="object-cover rounded-xl"
        src={image}
        style={{ objectFit: "cover", height: "150px", maxHeight: "150px" }}
      />
    </CardHeader>
    <CardBody className="text-ellipsis text-wrap max-h-28">
      <h4 className="font-bold text-large">{title}</h4>
      <small className="text-default-500">{description}</small>
    </CardBody>
    <CardFooter>
      <Button
        className="w-full"
        color={selected ? "success" : "primary"}
        onClick={onSelect}
      >
        {selected ? "Selected as Finalist" : "Select as Finalist"}
      </Button>
    </CardFooter>
  </Card>
);

export default function Home() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchedProjects, setSearchedProjects] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectIds, setProjectIds] = useState<{ [key: string]: number }>({});
  const [scanLoading, setScanLoading] = useState(false);

  const [nameModal, setNameModal] = useState(false);
  const [username, setUsername] = useState("");

  const modalBodyRef = useRef<HTMLElement | null>(null);

  const provider = new ethers.JsonRpcProvider(
    "https://jenkins.rpc.caldera.xyz/http",
    1798,
  );

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_HOST}/projects`).then((res) => res.json());
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      const result = await contract.getProjectIds();

      setProjectIds(
        result.reduce((acc: any, curr: any, index: any) => {
          acc[curr] = index;

          return acc;
        }, {}),
      );

      setProjects(res);
      setSearchedProjects(res);
    })();
  }, []);

  const onSubmit = async () => {
    // const res = await execHaloCmdWeb(
    //   {
    //     name: "get_data_struct",
    //     spec: "latchValue:1,publicKey:1",
    //   },
    //   {
    //     statusCallback: (cause: string) => {
    //       window.alert(cause);
    //     },
    //   }
    // );
    // console.log(
    //   `https://nfc.ethglobal.com?pk1=${res["data"]["publicKey:1"].toUpperCase()}&latch1=${res["data"]["latchValue:1"].toUpperCase()}`,
    // );

    try {
      setScanLoading(true);
      const votedIds = selectedProjects.map((val) => projectIds[val]);
      const signResult = await execHaloCmdWeb(
        {
          name: "sign",
          keyNo: 1,
          message: votedIds
            .map((id) => id.toString(16).padStart(4, "0"))
            .join(""),
        },
        {
          statusCallback: (cause: string) => {
            if (cause === "init") {
              toast.info(
                "Please tap the tag to the back of your smartphone and hold it...",
              );
            } else if (cause === "retry") {
              toast.warning(
                "Something went wrong, please try to tap the tag again...",
              );
            } else if (cause === "scanned") {
              toast.success(
                "Tag scanned successfully, post-processing the result...",
              );
            }
          },
        },
      );

      const apiResult = await fetch(
        `${API_HOST}/send-transaction?` +
          new URLSearchParams({
            v: signResult.signature.raw.v,
            r: `0x${signResult.signature.raw.r}`,
            s: `0x${signResult.signature.raw.s}`,
            hash: `0x${signResult.input.digest}`,
            votes: signResult.input.message,
            name: username,
          }).toString(),
        { method: "POST" },
      );

      if (apiResult.status == 200) {
        toast.success("Transaction sent successfully!");
      } else {
        toast.error(
          "An error occurred, please check if the voting is still open...",
        );
      }
    } catch (e) {
      toast.error(
        "An error occurred, please check if the voting is still open...",
      );
    }
    setScanLoading(false);
  };

  useEffect(() => {
    if (modalBodyRef.current) {
      const inputs = modalBodyRef.current.querySelectorAll(
        'input, textarea, select',
      );
      inputs.forEach((input) => {
        input.addEventListener('focus', () => {
          setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        });
      });
    }
  }, [nameModal]);

  return (
    <section className="flex flex-col items-center justify-center h-full">
      <Modal
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={nameModal}
        placement="auto"
        scrollBehavior="outside"
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Enter Username
          </ModalHeader>
          {/* // @ts-ignore */}
          <ModalBody ref={modalBodyRef}>
            <Input
              label="Username"
              type="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="w-full"
              color="primary"
              isDisabled={username.length < 3 || username.length > 29}
              isLoading={scanLoading}
              onClick={onSubmit}
            >
              Sign And Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Input
        isClearable
        className="p-4"
        placeholder="Search..."
        startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
        onChange={(e) => {
          setSearchedProjects(
            e.target.value !== ""
              ? projects.filter((p) =>
                  p.name.toLowerCase().includes(e.target.value.toLowerCase()),
                )
              : projects,
          );
        }}
        onClear={() => setSearchedProjects(projects)}
      />
      <div className="flex gap-4 h-full flex-wrap overflow-y-scroll justify-center px-5 pt-5 pb-20">
        {searchedProjects.map((project: any) => (
          <ProjectTile
            key={project.id}
            description={project.description}
            image={project.image}
            selected={selectedProjects.includes(project.id)}
            title={project.name}
            onSelect={() => {
              setSelectedProjects((prevSelectedProjects) =>
                prevSelectedProjects.includes(project.id)
                  ? prevSelectedProjects.filter((p) => p !== project.id)
                  : [...prevSelectedProjects, project.id],
              );
            }}
          />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 flex w-full items-center justify-center z-50 p-4 bg-gradient-to-t from-gray-800">
        <Button
          className="w-full cursor-pointer"
          color="primary"
          isDisabled={selectedProjects.length === 0}
          size="md"
          onClick={() => setNameModal(true)}
        >
          Sign And Submit
        </Button>
      </div>
    </section>
  );
}
