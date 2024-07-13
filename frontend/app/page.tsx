"use client";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Image,
} from "@nextui-org/react";
// @ts-ignore
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import { toast } from "react-toastify";
import { ethers } from "ethers";

import { siteConfig } from "@/config/site";
import { title } from "@/components/primitives";
import abi from "@/public/abi.json";

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
  <Card className="py-4 w-64 h-96">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
      <Image
        alt="Card image"
        className="object-cover rounded-xl"
        src={image}
        style={{ objectFit: "cover", height: "150px", maxHeight: "150px" }}
      />
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <h4 className="font-bold text-large">{title}</h4>
      <small className="text-default-500">{description}</small>
      <div className="flex items-center justify-center">
        <Checkbox isSelected={selected} onChange={onSelect}>
          Finalist?
        </Checkbox>
      </div>
    </CardBody>
  </Card>
);

export default function Home() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchedProjects, setSearchedProjects] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectIds, setProjectIds] = useState<{ [key: string]: number }>({});

  const provider = new ethers.JsonRpcProvider(
    "https://jenkins.rpc.caldera.xyz/http",
    1798,
  );

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_HOST}/projects`).then((res) => res.json());
      const contract = new ethers.Contract(
        "0xf7aDef4252fbba21ba8274E02cceB9F25f4f6FE4",
        abi,
        provider,
      );
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
      await execHaloCmdWeb(
        {
          name: "get_data_struct",
          spec: "latchValue",
        },
        {
          statusCallback: (cause: string) => {
            window.alert(cause);
          },
        }
      );
    // console.log(selectedProjects.map((val) => projectIds[val]));
    // try {
    //   await execHaloCmdWeb(
    //     {
    //       name: "sign",
    //       keyNo: 1,
    //       message: "000100020003",
    //     },
    //     {
    //       statusCallback: (cause: string) => {
    //         if (cause === "init") {
    //           toast.info(
    //             "Please tap the tag to the back of your smartphone and hold it...",
    //           );
    //         } else if (cause === "retry") {
    //           toast.warning(
    //             "Something went wrong, please try to tap the tag again...",
    //           );
    //         } else if (cause === "scanned") {
    //           toast.success(
    //             "Tag scanned successfully, post-processing the result...",
    //           );
    //         } else {
    //           toast.error("An error occurred, please try again...");
    //         }
    //       },
    //     },
    //   );
    // } catch (err: any) {
    //   toast.error(err);
    // }
  };

  return (
    <section className="flex flex-col items-center justify-center h-full gap-4">
      <div className="absolute bottom-0 left-0 flex w-full items-center justify-center z-50 p-4 bg-gradient-to-t from-white">
        <Button
          className="w-full cursor-pointer"
          color="primary"
          size="md"
          onClick={onSubmit}
        >
          Sign And Submit
        </Button>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="inline-block max-w-lg text-center">
          <h1 className={title({ color: "violet" })}>{siteConfig.name}</h1>
          <br />
          <span>websites regardless of your design experience.</span>
        </div>
      </div>
      <Input
        isClearable
        placeholder="Search..."
        startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
        onChange={(e) => {
          setSearchedProjects(
            e.target.value !== ""
              ? projects.filter((p) => p.name.includes(e.target.value))
              : projects,
          );
        }}
        onClear={() => setSearchedProjects(projects)}
      />
      <div className="flex gap-4 h-full flex-wrap overflow-y-scroll justify-center pb-20">
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
                  : [...prevSelectedProjects, project.name],
              );
            }}
          />
        ))}
      </div>
    </section>
  );
}
